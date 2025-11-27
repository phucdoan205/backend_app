using Microsoft.AspNetCore.Mvc;
using BackendApp.Data;
using BackendApp.DTOs;
using BackendApp.Models;
using BackendApp.Services;
using System.Linq;
using Microsoft.EntityFrameworkCore;

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
            // 1. Tìm user trong DB
            var user = _db.Users.FirstOrDefault(u => u.Username == dto.Username && u.Password == dto.Password);

            if (user == null) return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu" });

            // 2. Lấy config
            var key = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];

            // 3. Tạo Token (Truyền đúng user vừa tìm được vào)
            // Lúc này user.Role trong DB là gì thì Token sẽ chứa Role đó.
            var token = JwtService.CreateToken(user, key, issuer, audience);

            return Ok(new { 
                token = token, 
                role = user.Role, // Trả về Role để Frontend check
                username = user.Username 
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            // 1. Kiểm tra username (Sửa _context -> _db)
            if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại!" });
            }

            // 2. Tạo User mới
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = dto.Password, // Lưu ý: Thực tế nên mã hóa
                Role = "USER"
            };

            // 3. Lưu vào DB (Sửa _context -> _db)
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }
    }
}
