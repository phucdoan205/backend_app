using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BackendApp.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.Extensions.Caching.Memory;

namespace BackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        // Lấy doanh thu 7 ngày gần nhất
        [HttpGet("revenue-7-days")]
        public async Task<IActionResult> GetRevenueLast7Days()
        {
            var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

            var data = await _context.Orders
                .Where(o => o.CreateData >= sevenDaysAgo)
                .GroupBy(o => o.CreateData.Date)
                .Select(g => new {
                    Date = g.Key,
                    Total = g.Sum(o => o.TotalAmount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return Ok(data);
        }
        
        // Lấy số liệu thống kê cho 4 thẻ KPI
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);
            var newOrders = await _context.Orders.CountAsync(o => o.Status == 0); // 0: Mới
            var totalProducts = await _context.Products.CountAsync();
            var totalUsers = await _context.Users.CountAsync(u => u.Role == "USER");

            return Ok(new {
                Revenue = totalRevenue,
                NewOrders = newOrders,
                Products = totalProducts,
                Users = totalUsers
            });
        }

        [HttpGet("checkout-token")]
        [Authorize] // Bắt buộc phải đăng nhập (có token JWT) mới được lấy vé phụ
        public IActionResult GetCheckoutToken([FromServices] IMemoryCache cache)
        {
            // 1. Lấy ID người dùng từ Token JWT
            // Lấy Claim "id" đã được lưu trong token khi đăng nhập
            var userIdClaim = User.FindFirstValue("id"); 
            if (userIdClaim == null) return Unauthorized();

            // 2. Tạo chuỗi ngẫu nhiên (Vé phụ)
            var nonce = Guid.NewGuid().ToString();

            // 3. Lưu chuỗi này vào Cache Server trong 5 phút
            // Khóa (Key) của cache chính là ID người dùng
            cache.Set(userIdClaim, nonce, TimeSpan.FromMinutes(5));

            // 4. Trả về Token tạm thời cho Frontend
            return Ok(new { checkoutToken = nonce });
        }
    }
}