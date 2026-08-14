using System.Collections.Concurrent;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using RentSphere.AuthService.Data;

namespace RentSphere.AuthService.Services;

public class PasswordResetService
{
    private sealed record OtpEntry(string Hash, DateTime ExpiresAt, int Attempts);
    private static readonly ConcurrentDictionary<string, OtpEntry> Otps = new();
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public PasswordResetService(AppDbContext context, IConfiguration configuration, IWebHostEnvironment environment)
    {
        _context = context;
        _configuration = configuration;
        _environment = environment;
    }

    public async Task<string?> SendOtp(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        if (!await _context.Users.AnyAsync(user => user.Email.ToLower() == normalizedEmail))
            return null; // Do not reveal whether an account exists.

        var otp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        Otps[normalizedEmail] = new OtpEntry(BCrypt.Net.BCrypt.HashPassword(otp), DateTime.UtcNow.AddMinutes(10), 0);
        await SendEmail(normalizedEmail, otp);
        return _environment.IsDevelopment() && _configuration.GetValue<bool>("PasswordReset:ExposeOtpInDevelopment") ? otp : null;
    }

    public bool Verify(string email, string otp, bool consume = false)
    {
        var key = email.Trim().ToLowerInvariant();
        if (!Otps.TryGetValue(key, out var entry) || entry.ExpiresAt <= DateTime.UtcNow || entry.Attempts >= 5)
        {
            Otps.TryRemove(key, out _);
            return false;
        }

        if (!BCrypt.Net.BCrypt.Verify(otp, entry.Hash))
        {
            Otps[key] = entry with { Attempts = entry.Attempts + 1 };
            return false;
        }

        if (consume) Otps.TryRemove(key, out _);
        return true;
    }

    public async Task<bool> ResetPassword(string email, string otp, string newPassword)
    {
        if (!Verify(email, otp, true)) return false;
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await _context.Users.FirstOrDefaultAsync(item => item.Email.ToLower() == normalizedEmail);
        if (user == null) return false;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task SendEmail(string recipient, string otp)
    {
        var host = _configuration["Email:SmtpHost"];
        if (string.IsNullOrWhiteSpace(host))
        {
            if (_environment.IsDevelopment()) return;
            throw new InvalidOperationException("SMTP email settings are not configured.");
        }

        using var message = new MailMessage(_configuration["Email:From"]!, recipient,
            "RentSphere password reset OTP", $"Your RentSphere OTP is {otp}. It expires in 10 minutes.");
        using var client = new SmtpClient(host, _configuration.GetValue("Email:SmtpPort", 587))
        {
            EnableSsl = _configuration.GetValue("Email:EnableSsl", true),
            Credentials = new NetworkCredential(_configuration["Email:Username"], _configuration["Email:Password"])
        };
        await client.SendMailAsync(message);
    }
}
