using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using RentSphere.AuthService.Interfaces;
using RentSphere.AuthService.Models;

namespace RentSphere.AuthService.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!
                ));

            var credentials =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),

                new Claim("Id", user.Id.ToString()),

                new Claim(ClaimTypes.Name, user.FullName),

                new Claim(ClaimTypes.Role, user.Role),

                new Claim(JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString())
            };

            var token =
                new JwtSecurityToken(
                    issuer:_configuration["Jwt:Issuer"],
                    audience:_configuration["Jwt:Audience"],
                    claims:claims,
                    expires:DateTime.Now.AddMinutes(120),
                    signingCredentials:credentials
                );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}