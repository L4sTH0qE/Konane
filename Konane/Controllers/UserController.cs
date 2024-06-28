using System.Linq.Expressions;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace Konane.Controllers
{
    /// <summary>
    /// Describes user controller.
    /// </summary>
    [ApiController]
    public class UserController : ControllerBase
    {
        // Logger.
        private readonly ILogger<UserController> _logger;
        // Users repository.
        private readonly UsersRepository _users;
        
        /// <summary>
        /// Controller constructor.
        /// </summary>
        /// <param name="logger"> User controller logger via dependency injection.</param>
        /// <param name="users"> Users repository via dependency injection.</param>
        public UserController(ILogger<UserController> logger, UsersRepository users)
        {
            _users = users;
            _logger = logger;
        }

        /// <summary>
        /// Method to process HTTP GET request to get all users from database.
        /// </summary>
        /// <returns>The result of an action with the list of all users as its content.</returns>
        [HttpGet]
        [Route("[controller]")]
        public IActionResult Get()
        {
            _logger.LogInformation("Get Users");
            return Ok(_users.Get());
        }
        
        /// <summary>
        /// Method to process HTTP GET request to get user from database by its name.
        /// </summary>
        /// <param name="name"> Name of the user to get from database.</param>
        /// <returns>The result of an action with the specified user as its content.</returns>
        [HttpGet]
        [Route("[controller]/{name}")]
        public IActionResult Get(string name)
        {        
            _logger.LogInformation("Get User");
            return Ok(_users.Get().Find(x => x.Name == name));
        }

        /// <summary>
        /// Method to process HTTP POST request to post user to the database.
        /// </summary>
        /// <param name="user"> User to be created/updated in the database.</param>
        /// <returns>The result of an action with the specified user as its content.</returns>
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