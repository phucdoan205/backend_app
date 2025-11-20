[HttpPost("login")]
public IActionResult Login(LoginDto login)
{
    var user = _context.Users
        .FirstOrDefault(x => x.Username == login.Username && x.Password == login.Password);

    if (user == null)
        return Unauthorized("Sai username hoặc password");

    var token = _jwtService.GenerateToken(user);

    return Ok(new { token });
}