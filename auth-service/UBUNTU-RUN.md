# Run the Auth Service on Ubuntu

Install .NET 8 SDK and MySQL, then create the database:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS rentsphere_auth;"
```

The default configuration connects from Ubuntu/WSL to the Windows MySQL server at `172.17.192.1:3306`, using user `root`, password `root`. If `ip route | awk '/default/ {print $3}'` reports a different Windows host address, replace only the server address in `appsettings.json`.

From the directory containing `RentSphere.AuthService.csproj`:

```bash
rm -rf bin obj
dotnet restore
dotnet run --launch-profile http
```

Open `http://localhost:5279/swagger`. Development OTPs are returned by the forgot-password endpoint because `PasswordReset:ExposeOtpInDevelopment` is enabled.

All required password-reset files must be present:

```text
Services/PasswordResetService.cs
DTOs/ForgotPasswordRequest.cs
DTOs/VerifyOtpRequest.cs
DTOs/ResetPasswordRequest.cs
```
