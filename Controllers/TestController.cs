using Microsoft.AspNetCore.Mvc;
using BackendApp.Data;

namespace BackendApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TestController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("db")]
        public IActionResult TestDatabase()
        {
            try
            {
                // Test database connection
                var canConnect = _db.Database.CanConnect();
                
                if (!canConnect)
                {
                    return StatusCode(500, new { 
                        success = false, 
                        message = "Cannot connect to database",
                        connectionString = "***hidden***"
                    });
                }

                // Test query
                var categoryCount = _db.Categories.Count();
                var productCount = _db.Products.Count();
                var userCount = _db.Users.Count();

                return Ok(new { 
                    success = true, 
                    message = "Database connection successful",
                    counts = new {
                        categories = categoryCount,
                        products = productCount,
                        users = userCount
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Database error",
                    error = ex.Message,
                    innerException = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }
}


