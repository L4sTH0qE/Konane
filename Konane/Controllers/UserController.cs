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
        private static List<User> _users = GetData();

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
            SaveData();
            return Ok(user);
        }

        private static List<User> GetData()
        {
            try
            {
                using (StreamReader reader = new StreamReader("Data/users.json")) {
                    string? json = reader.ReadLine();
                    if (json == null)
                    {
                        return new List<User>();
                    }
                    
                    List<User>? data = JsonSerializer.Deserialize<List<User>>(json);
                    if (data == null)
                    {
                        return new List<User>();
                    }
                    
                    return data;
                }
            }
            catch (NullReferenceException)
            {
                return new List<User>();
            }
        }
        
        private static void SaveData()
        {
            try
            {
                string json = JsonSerializer.Serialize(_users);
                using (StreamWriter writer = new StreamWriter("Data/users.json", false))
                {
                    writer.WriteLine(json);
                }
            }
            catch (Exception)
            {
                Console.WriteLine("Error: cannot save user data into file!");
            }
        }
    }
}