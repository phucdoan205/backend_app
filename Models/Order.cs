using System;
using System.Collections.Generic;

namespace BackendApp.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public DateTime CreateData { get; set; }
        public string Status { get; set; } = "Pending";
        public decimal TotalAmount { get; set; }
        public List<OrderDetail> OrderDetails { get; set; } = new();
    }
}
