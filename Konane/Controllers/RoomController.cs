using Microsoft.AspNetCore.Mvc;

namespace Konane.Controllers
{
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private static Dictionary<string, Room> _rooms = new Dictionary<string, Room>();

        public RoomController(ILogger<UserController> logger)
        {
            _logger = logger;
        }
        
        [HttpGet]
        [Route("[controller]")]
        public IEnumerable<Room> Get()
        {
            _logger.LogInformation("Get Rooms");
            return _rooms.Values;
        }

        [HttpGet]
        [Route("[controller]/{roomId}")]
        public Room? Get(string roomId)
        {
            _logger.LogInformation("Get Room");
            return !_rooms.TryGetValue(roomId, out Room? room) ? null : _rooms[roomId];
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post([FromBody] Room room)
        {
            if (room.RoomId == null)
            {
                return Ok(room.RoomId);
            }
            _rooms.TryGetValue(room.RoomId, out Room? testRoom);
            _logger.LogInformation("Post Room");
            if (testRoom == null)
            {
                room.Status = "Waiting";
                _rooms[room.RoomId] = room;
                return Ok(room.RoomId);
            } else if (_rooms[room.RoomId].Status == "Waiting" && room.SecondPlayer != "") {
                room.Status = "Active";
                _rooms[room.RoomId] = room;
                return Ok(room.RoomId);
            } else if (_rooms[room.RoomId].Status == "Active") {
                room.Status = "Active";
                if (room.FirstTurnFinished && room.SecondTurnFinished)
                {
                    room.Status = "Finished";
                }
                _rooms[room.RoomId] = room;
                return Ok(room.RoomId);
            } 
            return Ok(room.RoomId);
        }
    }
}