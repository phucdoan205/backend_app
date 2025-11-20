namespace BackendApp.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; } // optional for response
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int Stock { get; set; }
    }
}
