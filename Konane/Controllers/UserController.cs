using System.Linq.Expressions;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Konane.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UsersRepository _users;
        
        public UserController(ILogger<UserController> logger, UsersRepository users)
        {
            _users = users;
            _logger = logger;
        }

        [HttpGet]
        [Route("[controller]")]
        public IActionResult Get()
        {
            _logger.LogInformation("Get Users");
            return Ok(_users.Get());
        }
        
        [HttpGet]
        [Route("[controller]/{name}")]
        public IActionResult Get(string name)
        {        
            _logger.LogInformation("Get User");
            return Ok(_users.Get().Find(x => x.Name == name));
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Post([FromBody] User user)
        {
            int index = _users.Get().FindIndex(x => x.Name == user.Name);
            if (index == -1)
            {
                User tmp = new User { Id = Guid.NewGuid(), Name = user.Name, Wins = 0 };
                _users.Create(tmp);
            } else
            {
                if (user.Wins != 0)
                {
                    _users.Update(user.Name, user.Wins);
                }
            }
            _logger.LogInformation("Post User");
            return StatusCode(StatusCodes.Status201Created, user);
        }
    }
}