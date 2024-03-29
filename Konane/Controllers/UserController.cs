using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Konane.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<UserController> _logger;
        private static List<User> _users = new List<User>();

        public UserController(IHubContext<NotificationHub> hubContext, ILogger<UserController> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }

        [HttpGet]
        [Route("[controller]")]
        public IEnumerable<User> Get()
        {
            return _users;
        }
        
        [HttpGet]
        [Route("[controller]/{name}")]
        public User? Get(string name)
        {
            return _users.Find(x => x.Username == name);
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post([FromBody] User user)
        {
            int index = _users.FindIndex(x => x.Username == user.Username);
            if (index == -1)
            {
                user.Id = _users.Count + 1;
                user.Wins = 0;
                _users.Add(user);
            }
            _hubContext.Clients.All.SendAsync("AddUser", user);

            return Ok(user);
        }
    }
}