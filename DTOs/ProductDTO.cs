namespace BackendApp.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }              // Giữ Id để sửa/xóa
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? Description { get; set; }
    }
}
