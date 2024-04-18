using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Konane.Controllers
{
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ILogger<RoomController> _logger;
        private readonly RoomsRepository _rooms;

        public RoomController(ILogger<RoomController> logger, RoomsRepository rooms)
        {
            _rooms = rooms;
            _logger = logger;
        }
        
        [HttpGet]
        [Route("[controller]")]
        public IActionResult Get()
        {
            _logger.LogInformation("Get Rooms");
            return Ok(_rooms.Get());
        }

        [HttpGet]
        [Route("[controller]/{roomId}")]
        public IActionResult Get(string roomId)
        {
            _logger.LogInformation("Get Room");
            return Ok(_rooms.Get().Find(x => x.RoomId == roomId));
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post([FromBody] Room room)
        {
            if (room.RoomId == null)
            {
                return StatusCode(StatusCodes.Status201Created, room);
            }

            int index = _rooms.Get().FindIndex(x => x.RoomId == room.RoomId);
            Room? tmp = _rooms.Get().Find(x => x.RoomId == room.RoomId);
            if (index == -1)
            {
                room.Id = Guid.NewGuid();
                room.Status = "Waiting";
                room.FirstFirstTurn = true;
                room.SecondFirstTurn = true;
                _rooms.Create(room);
            } else if (tmp?.Status == "Waiting" && room.SecondPlayer != "" && room.FirstPlayer != "") {
                room.Status = "Active";
                room.FirstFirstTurn = true;
                room.SecondFirstTurn = true;
                _rooms.Update(room.RoomId, room.FirstPlayer, room.SecondPlayer, room.CurrentPlayer, room.Board, 
                    room.FirstTurnFinished, room.SecondTurnFinished, room.FirstFirstTurn, room.SecondFirstTurn, room.Status);
            } else if (tmp?.Status == "Active") {
                room.Status = "Active";
                bool firstTurn = tmp.FirstFirstTurn;
                bool secondTurn = tmp.SecondFirstTurn;
                if (room.CurrentPlayer == room.FirstPlayer && room.SecondTurnFinished)
                {
                    secondTurn = false;
                }
                if (room.CurrentPlayer == room.SecondPlayer && room.FirstTurnFinished)
                {
                    firstTurn = false;
                }
                room.FirstFirstTurn = firstTurn;
                room.SecondFirstTurn = secondTurn;
                if (room.FirstTurnFinished && room.SecondTurnFinished)
                {
                    room.Status = "Finished";
                }
                _rooms.Update(room.RoomId, room.FirstPlayer, room.SecondPlayer, room.CurrentPlayer, room.Board, 
                    room.FirstTurnFinished, room.SecondTurnFinished, room.FirstFirstTurn, room.SecondFirstTurn, room.Status);
            }
            _logger.LogInformation("Post Room");
            return StatusCode(StatusCodes.Status201Created, room);
        }
    }
}