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
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public CustomersController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            return Ok(_mapper.Map<List<CustomerDTO>>(_db.Customers.ToList()));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create([FromBody] CustomerDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@")) return BadRequest("Email không hợp lệ");
            var c = _mapper.Map<Customer>(dto);
            _db.Customers.Add(c);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = c.Id }, _mapper.Map<CustomerDTO>(c));
        }
    }
}
