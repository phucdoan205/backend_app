using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApp.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; } 
        
        public DateTime CreateData { get; set; } 
        
        public int Status { get; set; }
        public decimal TotalAmount { get; set; }
        
        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; } 

        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}