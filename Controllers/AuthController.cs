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

            var token = JwtService.CreateToken(user, _config["Jwt:Key"], _config["Jwt:Issuer"], _config["Jwt:Audience"]);
            return Ok(new { token });
        }
    }
}
