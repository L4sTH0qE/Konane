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
        public Room? Get(string roomId, string player)
        {
            return !_rooms.TryGetValue(roomId, out Room? room) ? null : _rooms[roomId];
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post(string roomId, string player, [FromBody] Room room)
        {
            _rooms.TryGetValue(roomId, out Room? testRoom);
            if (testRoom == null)
            {
                room.Status = "Waiting";
                room.FirstPlayer = player;
                room.SecondPlayer = null;
                _rooms[roomId] = room;
                _hubContext.Clients.All.SendAsync("AddRoom", roomId);
                return Ok(roomId);
            } else if (_rooms[roomId].Status == "Finished") {
                room.Status = "Waiting";
                room.FirstPlayer = player;
                room.SecondPlayer = null;
                _rooms[roomId] = room;
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
            _rooms.TryGetValue(roomId, out Room? testRoom);
            if (testRoom != null)
            {
                if (_rooms[roomId].Status == "Waiting" && _rooms[roomId].FirstPlayer != player)
                {
                    _rooms[roomId].SecondPlayer = player;
                    _rooms[roomId].Status = "Active";
                    _hubContext.Clients.All.SendAsync("JoinRoom", roomId);
                    return Ok(roomId);
                } else if (_rooms[roomId].FirstPlayer == player || _rooms[roomId].SecondPlayer == player)
                {
                    _hubContext.Clients.All.SendAsync("JoinRoom", roomId);
                    return Ok(roomId);
                }
                else
                {
                    _hubContext.Clients.All.SendAsync("NotJoinRoom", roomId);
                    return Ok(roomId);
                }
            }
            _hubContext.Clients.All.SendAsync("NotJoinRoom", roomId);
            return Ok(roomId);
        }
    }
}