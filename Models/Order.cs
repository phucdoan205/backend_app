using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApp.Models
{
    public class Order
    {
        public int Id { get; set; }
<<<<<<< HEAD

        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public DateTime CreateDate { get; set; }

        public string Status { get; set; } = "Pending";

        public decimal TotalAmount { get; set; }

        public List<OrderDetail> OrderDetails { get; set; } = new();
=======
        
        // --- THÊM CỘT NÀY ĐỂ SỬA LỖI CustomerId ---
        public int CustomerId { get; set; }
        
        // Giữ nguyên các trường khác
        public DateTime OrderDate { get; set; } = DateTime.UtcNow; // Tên chuẩn là OrderDate
        public decimal TotalAmount { get; set; }
        public int Status { get; set; } // 0: Pending, 1: Shipping...

        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
>>>>>>> hong_backend
    }
}