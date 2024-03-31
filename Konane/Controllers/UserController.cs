using Microsoft.AspNetCore.Mvc;

namespace Konane.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private static List<User> _users = new List<User>();

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("[controller]")]
        public IEnumerable<User> Get()
        {
            _logger.LogInformation("Get Users");
            return _users;
        }
        
        [HttpGet]
        [Route("[controller]/{name}")]
        public User? Get(string name)
        {        
            _logger.LogInformation("Get User");
            return _users.Find(x => x.Name == name);
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post([FromBody] User user)
        {
            int index = _users.FindIndex(x => x.Name == user.Name);
            if (index == -1)
            {
                user.Id = _users.Count + 1;
                user.Wins = 0;
                _users.Add(user);
            } else
            {
                if (user.Wins != 0)
                {
                    _users[index].Wins = user.Wins;
                }
            }
            _logger.LogInformation("Post User");
            return Ok(user);
        }
    }
}