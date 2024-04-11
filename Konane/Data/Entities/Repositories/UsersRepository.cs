using Microsoft.EntityFrameworkCore;

namespace Konane
{
    public class UsersRepository
    {
        private readonly ApplicationContext _context;
 
        public UsersRepository(ApplicationContext context)
        {
            _context = context;
        }
 
        public List<User> Get()
        {
            var userEntities = _context.Users.ToList();
 
            var users = userEntities.Select(u => new User {Id = u.Id, Name = u.Name, Wins = u.Wins} ).ToList();
 
            return users;
        }
 
        public void Create(User user)
        {
            var userEntity = new UserEntity
            {
                Id = user.Id,
                Name = user.Name,
                Wins = user.Wins
            };
 
            _context.Users.Add(userEntity);
            _context.SaveChanges();
        }
 
        public void Update(string? name, int wins)
        {
            _context.Users
                .Where(u => u.Name == name)
                .ExecuteUpdate(u => u
                    .SetProperty(e => e.Wins, e => wins));
        }
 
        public void Delete(Guid id)
        {
            _context.Users
                .Where(u => u.Id == id)
                .ExecuteDelete();
        }
    }   
}