using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Konane.Controllers
{
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IHubContext<NotificationHub> _hubContext;
        private static Dictionary<string, Room> _rooms = new Dictionary<string, Room>();

        public RoomController(IHubContext<NotificationHub> hubContext, ILogger<UserController> logger)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("[controller]/{roomId}")]
        public Room? Get(string roomId)
        {
            return !_rooms.TryGetValue(roomId, out Room? room) ? null : _rooms[roomId];
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post([FromBody] Room room)
        {
            _rooms.TryGetValue(room.RoomId, out Room? testRoom);
            if (testRoom == null || _rooms[room.RoomId].Status == "Finished")
            {
                room.Status = "Waiting";
                _rooms[room.RoomId] = room;
                _hubContext.Clients.All.SendAsync("AddRoom", room.RoomId);
                return Ok(room.RoomId);
            } else if (_rooms[room.RoomId].Status == "Waiting") {
                room.Status = "Active";
                _rooms[room.RoomId] = room;
                _hubContext.Clients.All.SendAsync("AddRoom", room.RoomId);
                return Ok(room.RoomId);
            }
            _hubContext.Clients.All.SendAsync("NotAddRoom", room.RoomId);
            return Ok(room.RoomId);
        }
    }
}