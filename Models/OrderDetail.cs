using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApp.Models
{
    public class OrderDetail
    {
        public int Id { get; set; }

        // Thuộc về đơn hàng nào?
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        // Mua sản phẩm gì?
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        public int Quantity { get; set; } // Số lượng mua
        public decimal UnitPrice { get; set; } // Giá tại thời điểm mua
    }
}