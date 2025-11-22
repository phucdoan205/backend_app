using AutoMapper;
using BackendApp.Data;
using BackendApp.DTOs;
using BackendApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        // GET api/customers
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            var list = _db.Customers.ToList();
            var dto = _mapper.Map<List<CustomerDTO>>(list);
            return Ok(dto);
        }

        // GET api/customers/5
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id)
        {
            var c = _db.Customers.Find(id);
            if (c == null) return NotFound("Customer not found");

            return Ok(_mapper.Map<CustomerDTO>(c));
        }

        // POST api/customers
        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] CustomerDTO dto)
        {
            var c = _mapper.Map<Customer>(dto);
            _db.Customers.Add(c);
            _db.SaveChanges();

            return Ok(new { id = c.Id });
        }

        // PUT api/customers/5
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update(int id, [FromBody] CustomerDTO dto)
        {
            var c = _db.Customers.Find(id);
            if (c == null) return NotFound("Customer not found");

            _mapper.Map(dto, c);
            _db.SaveChanges();

            return Ok(new { message = "Updated" });
        }

        // DELETE api/customers/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var c = _db.Customers.Find(id);
            if (c == null) return NotFound("Customer not found");

            _db.Customers.Remove(c);
            _db.SaveChanges();

            return Ok(new { message = "Deleted" });
        }
    }
}
