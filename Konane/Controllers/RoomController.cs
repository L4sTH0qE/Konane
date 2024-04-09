using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Konane.Controllers
{
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ILogger<RoomController> _logger;
        private static Dictionary<string, Room> _rooms = GetData();

        public RoomController(ILogger<RoomController> logger)
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
                room.FirstFirstTurn = true;
                room.SecondFirstTurn = true;
                _rooms[room.RoomId] = room;
            } else if (_rooms[room.RoomId].Status == "Waiting" && room.SecondPlayer != "") {
                room.Status = "Active";
                room.FirstFirstTurn = true;
                room.SecondFirstTurn = true;
                _rooms[room.RoomId] = room;
            } else if (_rooms[room.RoomId].Status == "Active") {
                room.Status = "Active";
                bool firstTurn = _rooms[room.RoomId].FirstFirstTurn;
                bool secondTurn = _rooms[room.RoomId].SecondFirstTurn;
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
                _rooms[room.RoomId] = room;
            }
            SaveData();
            return Ok(room.RoomId);
        }
        
        private static Dictionary<string, Room> GetData()
        {
            try
            {
                using (StreamReader reader = new StreamReader("Data/rooms.json")) {
                    string? json = reader.ReadLine();
                    if (json == null)
                    {
                        return new Dictionary<string, Room>();
                    }
                    
                    List<Konane.Room>? data = JsonSerializer.Deserialize<List<Room>>(json);
                    if (data == null)
                    {
                        return new Dictionary<string, Room>();
                    }

                    Dictionary<string, Room> rooms = new Dictionary<string, Room>();
                    foreach (Room room in data)
                    {
                        string? id = room.RoomId;
                        if (id != null)
                        {
                            rooms[id] = room;
                        }
                    }
                    return rooms;
                }
            }
            catch (NullReferenceException)
            {
                return new Dictionary<string, Room>();
            }
        }
        
        private static void SaveData()
        {
            try
            {
                string json = JsonSerializer.Serialize(_rooms.Values);
                using (StreamWriter writer = new StreamWriter("Data/rooms.json", false))
                {
                    writer.WriteLine(json);
                }
            }
            catch (Exception)
            {
                Console.WriteLine("Error: cannot save room data into file!");
            }
        }
    }
}