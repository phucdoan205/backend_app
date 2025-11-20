using System.Collections.Generic;

namespace BackendApp.DTOs
{
    public class OrderCreateDTO
    {
        public int CustomerId { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new();
    }
}
