using Microsoft.EntityFrameworkCore;

namespace Konane
{
    /// <summary>
    /// Describes users repository.
    /// </summary>
    public class UsersRepository
    {
        // Database context.
        private readonly ApplicationContext _context;
 
        /// <summary>
        /// Repository default constructor.
        /// </summary>
        /// <param name="context"> Database context.</param>
        public UsersRepository(ApplicationContext context)
        {
            _context = context;
        }
 
        /// <summary>
        /// Method to get all users from database.
        /// </summary>
        /// <returns>List of all users.</returns>
        public List<User> Get()
        {
            var userEntities = _context.Users.ToList();
 
            var users = userEntities.Select(u => new User {Id = u.Id, Name = u.Name, Wins = u.Wins} ).ToList();
 
            return users;
        }
 
        /// <summary>
        /// Method to add new user to database.
        /// </summary>
        /// <param name="user"> User to be added to database.</param>
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
 
        /// <summary>
        /// Method to update user in database.
        /// </summary>
        public void Update(string? name, int wins)
        {
            _context.Users
                .Where(u => u.Name == name)
                .ExecuteUpdate(u => u
                    .SetProperty(e => e.Wins, e => wins));
        }
 
        /// <summary>
        /// Method to delete user from database.
        /// </summary>
        /// <param name="id"> Id of the user to delete from database.</param>
        public void Delete(Guid id)
        {
            _context.Users
                .Where(u => u.Id == id)
                .ExecuteDelete();
        }
    }   
}