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
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public CategoriesController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var list = _db.Categories.ToList();
                return Ok(_mapper.Map<List<CategoryDTO>>(list));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllCategories: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new { 
                    message = "Lỗi khi tải danh sách danh mục", 
                    error = ex.Message,
                    details = ex.InnerException?.Message 
                });
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var category = _db.Categories.Find(id);
            if (category == null) return NotFound();
            return Ok(_mapper.Map<CategoryDTO>(category));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create([FromBody] CategoryDTO dto)
        {
            var category = _mapper.Map<Category>(dto);
            _db.Categories.Add(category);
            _db.SaveChanges();
            return Ok(_mapper.Map<CategoryDTO>(category));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(int id, [FromBody] CategoryDTO dto)
        {
            var category = _db.Categories.Find(id);
            if (category == null) return NotFound();

            _mapper.Map(dto, category);
            _db.SaveChanges();

            return Ok(_mapper.Map<CategoryDTO>(category));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var category = _db.Categories.Find(id);
            if (category == null) return NotFound();

            _db.Categories.Remove(category);
            _db.SaveChanges();

            return Ok(new { message = "Deleted" });
        }
    }
}

