using System.ComponentModel.DataAnnotations;

namespace RentSphere.AuthService.DTOs;

public class VerifyOtpRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{6}$")]
    public string Otp { get; set; } = string.Empty;
}

