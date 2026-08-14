using BCrypt.Net;
using RentSphere.AuthService.Models;

namespace RentSphere.AuthService.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    FullName = "Administrator",

                    Email = "admin@rentsphere.com",

                    PasswordHash =
                        BCrypt.Net.BCrypt.HashPassword("Admin@123"),

                    Role = "ADMIN",

                    Phone = "9999999999"
                });

                context.SaveChanges();
            }
        }
    }
}