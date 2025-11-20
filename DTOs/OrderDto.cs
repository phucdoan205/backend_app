namespace backend.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public DateTime CreateDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
    }
}