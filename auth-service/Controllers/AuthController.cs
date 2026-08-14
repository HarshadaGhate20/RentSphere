using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentSphere.AuthService.DTOs;
using RentSphere.AuthService.Services;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using RentSphere.AuthService.Data;
using System.IdentityModel.Tokens.Jwt;

namespace RentSphere.AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        // 1. Explicitly use the full namespace path to bypass the namespace vs class name conflict
        private readonly RentSphere.AuthService.Services.AuthService _authService;
        private readonly RentSphere.AuthService.Services.PasswordResetService _passwordResetService;
        private readonly AppDbContext _dbContext;

        // 2. Updated the parameter type and matched the private field name
        public AuthController(RentSphere.AuthService.Services.AuthService authService, RentSphere.AuthService.Services.PasswordResetService passwordResetService, AppDbContext dbContext)
        {
            _authService = authService;
            _passwordResetService = passwordResetService;
            _dbContext = dbContext;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            var developmentOtp = await _passwordResetService.SendOtp(request.Email);
            return Ok(new { message = "If the email is registered, an OTP has been sent.", developmentOtp });
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp(VerifyOtpRequest request)
        {
            if (!_passwordResetService.Verify(request.Email, request.Otp))
                return BadRequest(new { message = "Invalid or expired OTP." });
            return Ok(new { message = "OTP verified." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            if (!await _passwordResetService.ResetPassword(request.Email, request.Otp, request.NewPassword))
                return BadRequest(new { message = "Invalid or expired OTP." });
            return Ok(new { message = "Password reset successful." });
        }

        // ==========================
        // Register API
        // ==========================
       [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await _authService.Register(request);

            if (result == "Email already exists")
                return BadRequest(new { message = result });

            // 🟢 Wraps the string response inside a JSON object: { "message": "Registration Successful" }
            return Ok(new { message = result });
        }


        // ==========================
        // Login API
        // ==========================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var response = await _authService.Login(request);

            if (response == null)
                return Unauthorized("Invalid Credentials");

            return Ok(response);
        }

        // ==========================
        // Any Logged-in User
        // ==========================
        [Authorize]
        [HttpGet("profile")]
        public IActionResult Profile()
        {
            return Ok("Welcome to RentSphere");
        }

        // ==========================
        // ADMIN Only
        // ==========================
        [Authorize(Roles = "ADMIN")]
        [HttpGet("admin")]
        public IActionResult Admin()
        {
            return Ok("Welcome Admin");
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var email = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                        ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var idClaim = User.FindFirst("Id")?.Value;
            var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(item =>
                (!string.IsNullOrWhiteSpace(email) && item.Email == email) ||
                (!string.IsNullOrWhiteSpace(idClaim) && item.Id.ToString() == idClaim));
            if (user == null) return NotFound(new { message = "User profile was not found." });
            return Ok(new { user.Id, FullName = user.FullName, user.Email, user.Phone, user.Role, user.CreatedAt });
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("admin/users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _dbContext.Users.AsNoTracking()
                .OrderByDescending(user => user.CreatedAt)
                .Select(user => new { user.Id, Name = user.FullName, user.Email, user.Role, user.Phone, user.CreatedAt })
                .ToListAsync();
            return Ok(users);
        }

        // ==========================
        // TENANT Only
        // ==========================
        [Authorize(Roles = "TENANT")]
        [HttpGet("tenant")]
        public IActionResult Tenant()
        {
            return Ok("Welcome Tenant");
        }

        // ==========================
        // LANDLORD Only
        // ==========================
        [Authorize(Roles = "LANDLORD")]
        [HttpGet("landlord")]
        public IActionResult Landlord()
        {
            return Ok("Welcome Landlord");
        }
        
    }
}
