using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using RentSphere.AuthService.Data;
using RentSphere.AuthService.DTOs;
using RentSphere.AuthService.Models;
using RentSphere.AuthService.Interfaces; 

namespace RentSphere.AuthService.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthService(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<string> Register(RegisterRequest request)
        {
            var exists = await _context.Users
                .AnyAsync(x => x.Email == request.Email);

            if (exists)
                return "Email already exists";

            User user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Phone = request.Phone,
                Role = request.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "Registration Successful";
        }

        // 🟢 Changed return type from Task<string?> to Task<LoginResponse?>
        public async Task<LoginResponse?> Login(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);

            if (user == null)
                return null;

            bool valid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!valid)
                return null;

            // 🟢 1. Generate the token string
            string token = _jwtService.GenerateToken(user);

            // 🟢 2. Build and return the structured Step 6 response object
            return new LoginResponse
            {
                Token = token,
                Name = user.FullName, // Maps database FullName to the required "name" property
                Email = user.Email,
                Role = user.Role.ToUpper() 
            };
        }
    }
}
