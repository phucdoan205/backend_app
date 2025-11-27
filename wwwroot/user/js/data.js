// js/data.js

/* KHO DỮ LIỆU SẢN PHẨM DÙNG CHUNG
  Lưu ý: Link ảnh được lấy từ Unsplash để demo giao diện đẹp.
  Trong thực tế bạn sẽ thay bằng link ảnh sản phẩm thật của shop bạn.
*/

const allProducts = [
    // --- 1. VGA (Card màn hình) ---
    { id: 101, name: "ASUS ROG Strix RTX 4090 OC", category: "VGA", brand: "ASUS", price: 62000000, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80" },
    { id: 102, name: "GIGABYTE RTX 3060 Gaming OC", category: "VGA", brand: "Gigabyte", price: 8500000, img: "https://images.unsplash.com/photo-1624705030784-191b2103d550?w=500&q=80" },
    { id: 103, name: "MSI GeForce RTX 4070 Ti", category: "VGA", brand: "MSI", price: 25990000, img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80" },
    { id: 104, name: "Colorful iGame RTX 3050", category: "VGA", brand: "Colorful", price: 6500000, img: "https://images.unsplash.com/photo-1555617981-d5451979123a?w=500&q=80" },
    { id: 105, name: "ASUS TUF Gaming RTX 4080", category: "VGA", brand: "ASUS", price: 35000000, img: "https://images.unsplash.com/photo-1591489378430-ef2f3c529634?w=500&q=80" },
    { id: 106, name: "NVIDIA RTX 3080 Founders", category: "VGA", brand: "NVIDIA", price: 18000000, img: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=500&q=80" },
    { id: 107, name: "Sapphire Nitro+ RX 7900 XTX", category: "VGA", brand: "AMD", price: 28000000, img: "https://images.unsplash.com/photo-1603483788474-c2565802f023?w=500&q=80" },
    { id: 108, name: "ZOTAC Gaming RTX 4060", category: "VGA", brand: "Zotac", price: 7900000, img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=80" },

    // --- 2. CPU (Vi xử lý) ---
    { id: 201, name: "Intel Core i9-13900K", category: "CPU", brand: "Intel", price: 14500000, img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80" },
    { id: 202, name: "AMD Ryzen 9 7950X3D", category: "CPU", brand: "AMD", price: 16500000, img: "https://images.unsplash.com/photo-1555617766-c94804975da3?w=500&q=80" },
    { id: 203, name: "Intel Core i5-13600K", category: "CPU", brand: "Intel", price: 7800000, img: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&q=80" },
    { id: 204, name: "AMD Ryzen 5 7600X", category: "CPU", brand: "AMD", price: 5900000, img: "https://images.unsplash.com/photo-1591799265444-d66432b91592?w=500&q=80" },
    { id: 205, name: "Intel Core i7-14700K", category: "CPU", brand: "Intel", price: 10900000, img: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=500&q=80" },
    { id: 206, name: "AMD Ryzen 7 5800X3D", category: "CPU", brand: "AMD", price: 8200000, img: "https://images.unsplash.com/photo-1580734079176-26482d732c72?w=500&q=80" },

    // --- 3. RAM ---
    { id: 301, name: "Corsair Vengeance RGB 32GB", category: "RAM", brand: "Corsair", price: 3500000, img: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&q=80" },
    { id: 302, name: "G.Skill Trident Z5 16GB", category: "RAM", brand: "G.Skill", price: 2100000, img: "https://images.unsplash.com/photo-1535240808488-42d207967572?w=500&q=80" },
    { id: 303, name: "Kingston Fury Beast 16GB", category: "RAM", brand: "Kingston", price: 1200000, img: "https://images.unsplash.com/photo-1626211877342-e79151d69db4?w=500&q=80" },
    { id: 304, name: "Adata XPG Spectrix D50", category: "RAM", brand: "Adata", price: 1500000, img: "https://images.unsplash.com/photo-1555616635-64096c03b94c?w=500&q=80" },
    { id: 305, name: "TeamGroup T-Force Delta", category: "RAM", brand: "TeamGroup", price: 1800000, img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&q=80" },
    
    // --- 4. LAPTOP GAMING ---
    { id: 401, name: "ASUS ROG Zephyrus G14", category: "Laptop", brand: "ASUS", price: 42000000, img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80" },
    { id: 402, name: "MSI Raider GE78", category: "Laptop", brand: "MSI", price: 55000000, img: "https://images.unsplash.com/photo-1611186871348-640e7091e133?w=500&q=80" },
    { id: 403, name: "Acer Nitro 5 Tiger", category: "Laptop", brand: "Acer", price: 21000000, img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80" },
    { id: 404, name: "Lenovo Legion 5 Pro", category: "Laptop", brand: "Lenovo", price: 32000000, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80" },
    { id: 405, name: "Dell Alienware m15 R7", category: "Laptop", brand: "Dell", price: 48000000, img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a9?w=500&q=80" },
    { id: 406, name: "MacBook Pro M3 Max", category: "Laptop", brand: "Apple", price: 80000000, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&q=80" },

    // --- 5. MÀN HÌNH & PC BỘ ---
    { id: 501, name: "PC Gaming Super Ultra", category: "PC", brand: "PC Master", price: 25000000, img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&q=80" },
    { id: 502, name: "Màn hình LG UltraGear 27", category: "Screen", brand: "LG", price: 8500000, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
    { id: 503, name: "Samsung Odyssey G9", category: "Screen", brand: "Samsung", price: 29000000, img: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500&q=80" },
];