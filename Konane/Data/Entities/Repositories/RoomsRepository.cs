using Microsoft.EntityFrameworkCore;

namespace Konane;

public class RoomsRepository
{
    private readonly ApplicationContext _context;
 
    public RoomsRepository(ApplicationContext context)
    {
        _context = context;
    }
 
    public List<Room> Get()
    {
        var roomEntities = _context.Rooms.ToList();
        
        var rooms = roomEntities.Select(r => new Room
            {
                Id = r.Id, RoomId = r.RoomId, Status = r.Status, FirstPlayer = r.FirstPlayer, SecondPlayer = r.SecondPlayer, CurrentPlayer = r.CurrentPlayer,
                Board = r.Board, FirstTurnFinished = r.FirstTurnFinished, SecondTurnFinished = r.SecondTurnFinished, FirstFirstTurn = r.FirstFirstTurn, SecondFirstTurn = r.SecondFirstTurn
            } 
        ).ToList();
 
        return rooms;
    }
 
    public void Create(Room room)
    {
        var roomEntity = new RoomEntity
        {
            Id = room.Id,
            RoomId = room.RoomId, 
            Status = room.Status, 
            FirstPlayer = room.FirstPlayer, 
            SecondPlayer = room.SecondPlayer, 
            CurrentPlayer = room.CurrentPlayer,
            Board = room.Board, 
            FirstTurnFinished = room.FirstTurnFinished, 
            SecondTurnFinished = room.SecondTurnFinished, 
            FirstFirstTurn = room.FirstFirstTurn, 
            SecondFirstTurn = room.SecondFirstTurn
        };
 
        _context.Rooms.Add(roomEntity);
        _context.SaveChanges();
    }
    
    public void Update(string? roomId, string? firstPlayer, string? secondPlayer, string? currentPlayer, string? board, 
        bool firstTurnFinished, bool secondTurnFinished, bool firstFirstTurn, bool secondFirstTurn, string? status) {
        _context.Rooms
            .Where(r => r.RoomId == roomId)
            .ExecuteUpdate(r => r
                .SetProperty(e => e.FirstPlayer, e => firstPlayer)
                .SetProperty(e => e.SecondPlayer, e => secondPlayer)
                .SetProperty(e => e.CurrentPlayer, e => currentPlayer)
                .SetProperty(e => e.Board, e => board)
                .SetProperty(e => e.FirstTurnFinished, e => firstTurnFinished)
                .SetProperty(e => e.SecondTurnFinished, e => secondTurnFinished)
                .SetProperty(e => e.FirstFirstTurn, e => firstFirstTurn)
                .SetProperty(e => e.SecondFirstTurn, e => secondFirstTurn)
                .SetProperty(e => e.Status, e => status));
    }
 
    public void Delete(string? roomId)
    {
        _context.Rooms
            .Where(r => r.RoomId == roomId)
            .ExecuteDelete();
    }
}