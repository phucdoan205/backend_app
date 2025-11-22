using Microsoft.AspNetCore.Mvc;
using BackendApp.Data;
using BackendApp.DTOs;
using BackendApp.Services;
using System.Linq;

namespace BackendApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO dto)
        {
            var user = _db.Users.FirstOrDefault(u => u.Username == dto.Username && u.Password == dto.Password);
            if (user == null) return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu" });

            var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing");
            var issuer = _config["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is missing");
            var audience = _config["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is missing");

            var token = JwtService.CreateToken(user, key, issuer, audience);
            return Ok(new { token });
        }
    }
}
