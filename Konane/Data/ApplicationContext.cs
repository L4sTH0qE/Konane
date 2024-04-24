using Microsoft.EntityFrameworkCore;
 
namespace Konane
{
    /// <summary>
    /// Describes context that is used for interaction with a database.
    /// </summary>
    public class ApplicationContext : DbContext
    {
        /// <summary>
        /// Property for Room entity in the model.
        /// </summary>
        public DbSet<RoomEntity> Rooms { get; set; } = null!;
        
        /// <summary>
        /// Enter description for method anotherMethod.
        /// ID string generated is "M:MyNamespace.MyClass.anotherMethod(System.Int16[],System.Int32[0:,0:])".
        /// </summary>
        public DbSet<UserEntity> Users { get; set; } = null!;
        
        /// <summary>
        /// Default context constructor.
        /// </summary>
        /// <param name="options"> The options for this context.</param>
        public ApplicationContext(DbContextOptions<ApplicationContext> options): base(options)
        {

        }
        
        /// <summary>
        /// Method to configure the database (and other options) to be used for this context.
        /// </summary>
        /// <param name="optionsBuilder">A simple API surface for configuring DbContextOptions.</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=konane;Username=postgres;Password=12345678");
        }
    }
}