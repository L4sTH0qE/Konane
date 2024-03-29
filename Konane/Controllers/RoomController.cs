using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Konane.Controllers
{
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IHubContext<NotificationHub> _hubContext;
        private static List<Room> _rooms = new List<Room>();

        public RoomController(IHubContext<NotificationHub> hubContext, ILogger<UserController> logger)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("[controller]/{roomId}")]
        public Room? Get(string roomId)
        {
            return _rooms.Find(x => x.RoomId == roomId && x.Status != "Finished");
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post(string roomId, string player, [FromBody] Room room)
        {
            int index = _rooms.FindIndex(x => x.RoomId == roomId);
            if (index == -1) {
                room.Id = _rooms.Count + 1;
                room.Status = "Waiting";
                room.FirstPlayer = player;
                _rooms.Add(room);
                _hubContext.Clients.All.SendAsync("AddRoom", roomId);
                return Ok(roomId);
            }
            else if (_rooms[index].Status == "Finished") {
                _rooms[index].Status = "Waiting";
                _rooms[index].FirstPlayer = player;
                _rooms[index].SecondPlayer = null;
                _hubContext.Clients.All.SendAsync("AddRoom", roomId);
                return Ok(roomId);
            }
            _hubContext.Clients.All.SendAsync("NotAddRoom", roomId);
            return Ok(roomId);
        }
        
        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post(string roomId, string player)
        {
            int index = _rooms.FindIndex(x => x.RoomId == roomId);
            if (index != -1)
            {
                Room room = _rooms[index];
                if (room.Status == "Waiting")
                {
                    room.SecondPlayer = player;
                    room.Status = "Active";
                    _hubContext.Clients.All.SendAsync("JoinRoom", roomId);
                    return Ok(roomId);
                }
            }
            _hubContext.Clients.All.SendAsync("NotJoinRoom", roomId);
            return Ok(roomId);
        }
    }
}