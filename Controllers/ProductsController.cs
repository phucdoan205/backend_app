using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BackendApp.Data;
using BackendApp.DTOs;
using BackendApp.Models;

namespace BackendApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public ProductsController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _db.Products.ToList();
            return Ok(_mapper.Map<List<ProductDTO>>(list));
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var p = _db.Products.Find(id);
            if (p == null) return NotFound();
            return Ok(_mapper.Map<ProductDTO>(p));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create([FromBody] ProductDTO dto)
        {
            var p = _mapper.Map<Product>(dto);
            _db.Products.Add(p);
            _db.SaveChanges();
            return Ok(_mapper.Map<ProductDTO>(p));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(int id, [FromBody] ProductDTO dto)
        {
            var p = _db.Products.Find(id);
            if (p == null) return NotFound();

            _mapper.Map(dto, p);
            _db.SaveChanges();

            return Ok(_mapper.Map<ProductDTO>(p));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var p = _db.Products.Find(id);
            if (p == null) return NotFound();

            _db.Products.Remove(p);
            _db.SaveChanges();

            return Ok(new { message = "Deleted" });
        }
    }
}
