namespace RentSphere.AuthService.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty; // 🟢 Changed from FullName to Name
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
