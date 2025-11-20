using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id)
        {
            var order = _db.Orders
                           .Where(o => o.Id == id)
                           .Select(o => new {
                               o.Id, o.CustomerId, o.CreateData, o.Status, o.TotalAmount,
                               Items = o.OrderDetails.Select(d => new { d.ProductId, d.Quantity, d.UnitPrice })
                           }).FirstOrDefault();
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public IActionResult Create([FromBody] OrderCreateDTO dto)
        {
            if (dto.Items == null || !dto.Items.Any()) return BadRequest("Items required");
            if (dto.Items.Any(i => i.Quantity <= 0)) return BadRequest("Quantity must be > 0");

            var customer = _db.Customers.Find(dto.CustomerId);
            if (customer == null) return NotFound("Customer not found");

            var order = _mapper.Map<Order>(dto);
            order.CreateData = DateTime.UtcNow;
            order.Status = "Pending";
            _db.Orders.Add(order);
            _db.SaveChanges(); // get order.Id

            decimal total = 0;
            foreach (var item in dto.Items)
            {
                var product = _db.Products.Find(item.ProductId);
                if (product == null) return NotFound($"Product {item.ProductId} not found");
                if (product.Stock < item.Quantity) return BadRequest($"Not enough stock for {product.Name}");

                var detail = _mapper.Map<OrderDetail>(item);
                detail.OrderId = order.Id;
                detail.UnitPrice = product.Price;
                _db.OrderDetails.Add(detail);

                product.Stock -= item.Quantity;
                total += product.Price * item.Quantity;
            }

            order.TotalAmount = total;
            _db.SaveChanges();

            return CreatedAtAction(nameof(Get), new { id = order.Id }, new { order.Id, order.TotalAmount });
        }
    }
}
