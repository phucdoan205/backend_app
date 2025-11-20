public class JwtService
{
    private readonly string _secret;
    private readonly string _issuer;

    public JwtService(IConfiguration config)
    {
        _secret = config["Jwt:Key"];
        _issuer = config["Jwt:Issuer"];
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,
            expires: DateTime.Now.AddHours(5),
            claims: claims,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
