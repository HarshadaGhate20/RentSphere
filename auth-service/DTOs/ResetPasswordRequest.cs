using System.ComponentModel.DataAnnotations;

namespace RentSphere.AuthService.DTOs;

public class ResetPasswordRequest : VerifyOtpRequest
{
    [Required, MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}

