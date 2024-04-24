using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace Konane.Controllers
{
    /// <summary>
    /// Describes room controller.
    /// </summary>
    [ApiController]
    public class RoomController : ControllerBase
    {
        // Logger.
        private readonly ILogger<RoomController> _logger;
        // Rooms repository.
        private readonly RoomsRepository _rooms;

        /// <summary>
        /// Controller constructor.
        /// </summary>
        /// <param name="logger"> Room controller logger via dependency injection.</param>
        /// <param name="rooms"> Rooms repository via dependency injection.</param>
        public RoomController(ILogger<RoomController> logger, RoomsRepository rooms)
        {
            _rooms = rooms;
            _logger = logger;
        }
        
        /// <summary>
        /// Method to process HTTP GET request to get all rooms from database.
        /// </summary>
        /// <returns>The result of an action with the list of all rooms as its content.</returns>
        [HttpGet]
        [Route("[controller]")]
        public IActionResult Get()
        {
            _logger.LogInformation("Get Rooms");
            return Ok(_rooms.Get());
        }

        /// <summary>
        /// Method to process HTTP GET request to get room from database by its id.
        /// </summary>
        /// <param name="roomId"> Id of the room to get from database.</param>
        /// <returns>The result of an action with the specified room as its content.</returns>
        [HttpGet]
        [Route("[controller]/{roomId}")]
        public IActionResult Get(string roomId)
        {
            _logger.LogInformation("Get Room");
            return Ok(_rooms.Get().Find(x => x.RoomId == roomId));
        }

        /// <summary>
        /// Method to process HTTP POST request to post room to the database.
        /// </summary>
        /// <param name="room"> Room to be created/updated in the database.</param>
        /// <returns>The result of an action with the specified room as its content.</returns>
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