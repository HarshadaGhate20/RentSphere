using RentSphere.AuthService.Models;

namespace RentSphere.AuthService.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
