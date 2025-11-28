using AutoMapper;
using BackendApp.Data;
using BackendApp.DTOs;
using BackendApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        // Trong OrdersController.cs, bên trong class OrdersController
        // [HttpGet]
        // [Route("test")] // Đường dẫn là: /api/orders/test
        // public IActionResult TestRoute()
        // {
        //     return Ok("OrdersController is running!");
        // }

        // GET api/orders/{id}
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id)
        {
            var order = _db.Orders
<<<<<<< HEAD
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);

=======
                           .Where(o => o.Id == id)
                           .Select(o => new {
                               o.Id,
                               o.CustomerId,
                               o.OrderDate,
                               o.Status,
                               o.TotalAmount,
                               Items = o.OrderDetails.Select(d => new { d.ProductId, d.Quantity, d.UnitPrice })
                           }).FirstOrDefault();
>>>>>>> hong_backend
            if (order == null) return NotFound();

            return Ok(new
            {
                order.Id,
                order.CustomerId,
                order.CreateDate,
                order.Status,
                order.TotalAmount,
                Items = order.OrderDetails.Select(d => new
                {
                    d.ProductId,
                    d.Quantity,
                    d.UnitPrice
                })
            });
        }

        // POST api/orders
        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public IActionResult Create([FromBody] OrderCreateDTO dto)
        {
<<<<<<< HEAD
            // 1. Validation cơ bản (Bổ sung kiểm tra Quantity > 0)
            if (dto.Items == null || !dto.Items.Any())
                return BadRequest("Items required");
            if (dto.Items.Any(i => i.Quantity <= 0))
                return BadRequest("Quantity must be greater than 0"); // Bắt buộc phải có theo đề thi

            var customer = _db.Customers.Find(dto.CustomerId);
            if (customer == null)
                return NotFound("Customer not found");

            // 2. BẮT ĐẦU TRANSACTION để đảm bảo tính toàn vẹn dữ liệu
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // TẠO ORDER (CHƯA LƯU DB)
                    var order = new Order
                    {
                        CustomerId = dto.CustomerId,
                        CreateDate = DateTime.UtcNow,
                        Status = "Pending",
                        TotalAmount = 0,
                        // OrderDetails sẽ được tự động liên kết (tracking)
                    };

                    _db.Orders.Add(order);

                    decimal total = 0;

                    foreach (var item in dto.Items)
                    {
                        var product = _db.Products.Find(item.ProductId);
                        if (product == null)
                            // Ném Exception để Rollback Transaction
                            throw new Exception($"Product {item.ProductId} not found");

                        // KIỂM TRA TỒN KHO
                        if (product.Stock < item.Quantity)
                            // Ném Exception để Rollback Transaction
                            throw new Exception($"Not enough stock for {product.Name}");

                        // TẠO ORDER DETAIL
                        var detail = new OrderDetail
                        {
                            Order = order, // Gán đối tượng Order thay vì OrderId
                            ProductId = product.Id,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price
                        };

                        _db.OrderDetails.Add(detail);

                        // TRỪ TỒN KHO
                        product.Stock -= item.Quantity;

                        total += item.Quantity * product.Price;
                    }

                    // Cập nhật tổng tiền
                    order.TotalAmount = total;

                    // 3. LƯU TẤT CẢ THAY ĐỔI MỘT LẦN DUY NHẤT
                    _db.SaveChanges();

                    // 4. CAM KẾT TRANSACTION (NẾU THÀNH CÔNG)
                    transaction.Commit();

                    return CreatedAtAction(nameof(Get), new { id = order.Id }, new
                    {
                        order.Id,
                        order.TotalAmount
                    });
                }
                catch (Exception ex)
                {
                    // 5. ROLLBACK TRANSACTION nếu có bất kỳ lỗi nào (hết hàng, sản phẩm không tồn tại...)
                    transaction.Rollback();
                    // Trả về 400 Bad Request kèm thông báo lỗi chi tiết
                    return BadRequest($"Lỗi tạo đơn hàng: {ex.Message}");
                }
            }
=======
            // 1. Validate input
            if (dto.Items == null || !dto.Items.Any()) return BadRequest("Đơn hàng phải có ít nhất 1 sản phẩm.");

            // 2. Kiểm tra User (Đổi Customers -> Users)
            var user = _db.Users.Find(dto.CustomerId);
            if (user == null) return NotFound("Khách hàng không tồn tại.");

            // 3. Tạo Order (Header)
            var order = new Order
            {
                OrderDate = DateTime.UtcNow,
                Status = 0, // Pending
                TotalAmount = 0 // Tính sau
            };

            _db.Orders.Add(order);
            _db.SaveChanges(); // Lưu để lấy OrderId

            decimal total = 0;

            // 4. Duyệt từng sản phẩm để tạo Detail
            foreach (var item in dto.Items)
            {
                var product = _db.Products.Find(item.ProductId);
                
                if (product == null) return NotFound($"Sản phẩm ID {item.ProductId} không tồn tại.");
                
                // Kiểm tra tồn kho (Xử lý Nullable)
                int currentStock = product.Stock ?? 0; // Nếu null thì coi như 0
                if (currentStock < item.Quantity) 
                    return BadRequest($"Sản phẩm '{product.Name}' không đủ hàng (Còn: {currentStock}).");

                // Tạo chi tiết đơn hàng
                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price // Lấy giá hiện tại, xử lý null
                };
                
                _db.OrderDetails.Add(detail);

                // Trừ tồn kho
                product.Stock = currentStock - item.Quantity;
                
                // Cộng dồn tổng tiền
                total += (detail.UnitPrice * detail.Quantity);
            }

            // 5. Cập nhật lại tổng tiền cho Order
            order.TotalAmount = total;
            _db.SaveChanges(); // Lưu lần cuối (Detail + Update Order)

            return CreatedAtAction(nameof(Get), new { id = order.Id }, new { order.Id, order.TotalAmount });
>>>>>>> hong_backend
        }
    }
}
