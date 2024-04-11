using Microsoft.EntityFrameworkCore;
 
namespace Konane
{
    public class ApplicationContext : DbContext
    {
        public DbSet<RoomEntity> Rooms { get; set; } = null!;
        
        public DbSet<UserEntity> Users { get; set; } = null!;
        
        public ApplicationContext(DbContextOptions<ApplicationContext> options): base(options)
        {

        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=konane;Username=postgres;Password=12345678");
        }
    }
}