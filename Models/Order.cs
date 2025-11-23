using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApp.Models
{
    public class Order
    {
        public int Id { get; set; }
        
        // --- THÊM CỘT NÀY ĐỂ SỬA LỖI CustomerId ---
        public int CustomerId { get; set; }
        
        // Giữ nguyên các trường khác
        public DateTime OrderDate { get; set; } = DateTime.UtcNow; // Tên chuẩn là OrderDate
        public decimal TotalAmount { get; set; }
        public int Status { get; set; } // 0: Pending, 1: Shipping...

        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}