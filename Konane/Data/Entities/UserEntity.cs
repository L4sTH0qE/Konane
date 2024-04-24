namespace Konane
{
    /// <summary>
    /// Describes user entity.
    /// </summary>
    public class UserEntity
    {
        public Guid Id { get; set; }
        
        public string? Name { get; set; }

        public int Wins { get; set; }
    }       
}