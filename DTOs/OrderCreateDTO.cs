namespace BackendApp.DTOs
{
    public class OrderCreateDTO
    {
        public int CustomerId { get; set; }
        public string Name { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Address { get; set; } = "";

        public string ShippingNotes { get; set; } = "";
        public List<OrderItemDTO> Items { get; set; } = new List<OrderItemDTO>();
    }
}