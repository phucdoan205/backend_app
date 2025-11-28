using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BackendApp.Data;
using BackendApp.DTOs;
using BackendApp.Models;
using System.Linq;

namespace BackendApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public OrdersController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        // 1. GET: Lấy chi tiết đơn hàng (SỬA ĐỂ KHỚP VỚI DB)
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _db.Orders
                               .Include(o => o.OrderDetails)
                               .ThenInclude(od => od.Product)
                               .Where(o => o.Id == id)
                               .FirstOrDefaultAsync(); 

            if (order == null) return NotFound();
            
            // Trả về DTO (Anonymous Type)
            return Ok(new {
                order.Id,
                order.CustomerId,
                CreateDate = order.CreateData, // Khớp với tên cột trong DB
                order.Status,
                order.TotalAmount,
                // Bỏ các trường CustomerName/Phone/Address vì chúng không tồn tại trong Order.cs
                
                Items = order.OrderDetails.Select(d => new { d.ProductId, d.Quantity, d.UnitPrice })
            });
        }

        // 2. POST: Hàm tạo đơn hàng duy nhất (FINAL FIX)
        [HttpPost]
        [Authorize(Roles = "USER,ADMIN")] 
        public async Task<IActionResult> Create([FromBody] OrderCreateDTO dto)
        {
            // 1. Validate input và tìm User/Customer
            if (dto.Items == null || !dto.Items.Any()) return BadRequest("Đơn hàng phải có ít nhất 1 sản phẩm.");
            
            // Lấy ID người dùng từ DTO
            var user = await _db.Users.FindAsync(dto.CustomerId); 
            if (user == null) return Unauthorized("Phiên đăng nhập không hợp lệ.");

            // 1.1. ĐỒNG BỘ HÓA CUSTOMER (Tạo hồ sơ nếu chưa có - FIX LỖI 404)
            var customerRecord = await _db.Customers.FindAsync(dto.CustomerId);
            if (customerRecord == null)
            {
                // Giả sử DTO gửi đủ thông tin cần thiết
                customerRecord = new Customer
                {
                    Id = dto.CustomerId, 
                    Name = dto.Name, 
                    Email = user.Email,      
                    Phone = dto.Phone,
                    Address = dto.Address
                };
                _db.Customers.Add(customerRecord);
                await _db.SaveChangesAsync(); // Lưu hồ sơ Customers mới
            }


            // 2. Tạo đơn hàng (Header)
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                CreateData = DateTime.UtcNow,
                Status = 0, // Pending
                TotalAmount = 0
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync(); // Lưu lần 1 để lấy OrderId

            decimal total = 0;

            // 3. Xử lý chi tiết, tồn kho, và tính tổng tiền
            foreach (var item in dto.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                
                if (product == null || !product.Stock.HasValue || product.Stock.Value < item.Quantity)
                {
                    return BadRequest($"Không đủ hàng cho SP ID {item.ProductId}. Tồn kho: {product?.Stock ?? 0}");
                }

                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };
                _db.OrderDetails.Add(detail);

                // Trừ tồn kho
                product.Stock = product.Stock.Value - item.Quantity;
                total += detail.Quantity * detail.UnitPrice;
            }

            // 4. Cập nhật tổng tiền và lưu lần cuối
            order.TotalAmount = total;
            _db.Update(order);
            await _db.SaveChangesAsync(); 

            // Trả về response thành công
            return CreatedAtAction(nameof(Get), new { id = order.Id }, new { message = "Đặt hàng thành công", orderId = order.Id, totalAmount = order.TotalAmount });
        }
    }
}