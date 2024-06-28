namespace Konane
{
    /// <summary>
    /// Describes room entity.
    /// </summary>
    public class RoomEntity
    {
        public Guid Id { get; set; }
        
        public string? RoomId { get; set; }

        public string? Status { get; set; }

        public string? FirstPlayer { get; set; }
        
        public string? SecondPlayer { get; set; }
        
        public string? CurrentPlayer { get; set; }
        
        public string? Board { get; set; }
        
        public bool FirstTurnFinished { get; set; }
        
        public bool SecondTurnFinished { get; set; }
        
        public bool FirstFirstTurn { get; set; }
        
        public bool SecondFirstTurn { get; set; }
    }
}