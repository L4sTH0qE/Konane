namespace Konane
{
    /// <summary>
    /// Describes user model.
    /// </summary>
    public class User
    {
        public Guid Id { get; set; }
        
        public string? Name { get; set; }

        public int Wins { get; set; }
    }
}