// Models/OrderDetail.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApp.Models
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; } 
        
        [ForeignKey("ProductId")]
        public Product? Product { get; set; } 
    }
}