namespace backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime CreateDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }

        public Customer Customer { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}