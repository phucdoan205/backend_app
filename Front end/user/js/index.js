// js/home.js

// Dữ liệu mẫu mở rộng (Database giả lập)
const dbProducts = [
    // PC Gaming
    { id: 101, name: "PC Gaming Cyber 2077", price: 25900000, category: "PC", img: "https://via.placeholder.com/200" },
    { id: 102, name: "PC Master Race i9", price: 45000000, category: "PC", img: "https://via.placeholder.com/200" },
    { id: 103, name: "PC Streamer Pro", price: 32000000, category: "PC", img: "https://via.placeholder.com/200" },
    { id: 104, name: "PC Budget King", price: 12000000, category: "PC", img: "https://via.placeholder.com/200" },
    
    // VGA
    { id: 201, name: "NVIDIA RTX 4090", price: 48000000, category: "VGA", img: "https://via.placeholder.com/200" },
    { id: 202, name: "NVIDIA RTX 3060", price: 8500000, category: "VGA", img: "https://via.placeholder.com/200" },
    { id: 203, name: "AMD Radeon RX 7900", price: 22000000, category: "VGA", img: "https://via.placeholder.com/200" },
    { id: 204, name: "GTX 1660 Super", price: 4500000, category: "VGA", img: "https://via.placeholder.com/200" },

    // Laptop
    { id: 301, name: "Laptop ASUS ROG Strix", price: 35000000, category: "Laptop", img: "https://via.placeholder.com/200" },
    { id: 302, name: "Macbook Pro M3", price: 42000000, category: "Laptop", img: "https://via.placeholder.com/200" },
    { id: 303, name: "Acer Nitro 5", price: 18000000, category: "Laptop", img: "https://via.placeholder.com/200" },
    { id: 304, name: "MSI Katana GF66", price: 24000000, category: "Laptop", img: "https://via.placeholder.com/200" },

    // Flash Sale (Hỗn hợp)
    { id: 901, name: "Chuột Logitech G Pro", price: 1900000, category: "Gear", img: "https://via.placeholder.com/200" },
    { id: 902, name: "Bàn phím Keychron K2", price: 1500000, category: "Gear", img: "https://via.placeholder.com/200" },
    { id: 903, name: "Tai nghe HyperX Cloud", price: 1200000, category: "Gear", img: "https://via.placeholder.com/200" },
    { id: 904, name: "Màn hình LG 24 inch", price: 3100000, category: "Screen", img: "https://via.placeholder.com/200" },
    { id: 905, name: "SSD Samsung 1TB", price: 1850000, category: "SSD", img: "https://via.placeholder.com/200" }
];

// Hàm render sản phẩm dùng chung
function createProductCard(p) {
    return `
        <div class="product-card">
            <div class="category">${p.category}</div>
            <h3 onclick="goToShop('${p.category}')">${p.name}</h3>
            <div class="price">${Number(p.price).toLocaleString()}đ</div>
            <button onclick="quickAdd(${p.id}, '${p.name}', ${p.price})">
                <i class="fas fa-cart-plus"></i> Thêm
            </button>
        </div>
    `;
}

// Render các Section
function initHomePage() {
    // 1. Render Flash Sale
    const flashSaleContainer = document.getElementById('flash-sale-grid');
    const saleItems = dbProducts.slice(-5); // Lấy 5 item cuối làm Flash Sale
    flashSaleContainer.innerHTML = saleItems.map(p => createProductCard(p)).join('');

    // 2. Render PC Gaming
    const pcContainer = document.getElementById('pc-grid');
    const pcItems = dbProducts.filter(p => p.category === 'PC');
    pcContainer.innerHTML = pcItems.map(p => createProductCard(p)).join('');

    // 3. Render VGA
    const vgaContainer = document.getElementById('vga-grid');
    const vgaItems = dbProducts.filter(p => p.category === 'VGA');
    vgaContainer.innerHTML = vgaItems.map(p => createProductCard(p)).join('');

    // 4. Render Laptop
    const laptopContainer = document.getElementById('laptop-grid');
    const laptopItems = dbProducts.filter(p => p.category === 'Laptop');
    laptopContainer.innerHTML = laptopItems.map(p => createProductCard(p)).join('');
}

// Xử lý Click chuyển hướng
function goToShop(category) {
    // Chuyển sang trang index.html và có thể gắn thêm query params để lọc (nâng cao sau)
    window.location.href = `index.html?category=${category}`;
}

// Xử lý thêm nhanh vào giỏ (Logic rút gọn của index.js)
function quickAdd(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(x => x.id === id);
    if(exist) {
        exist.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1, image: "https://via.placeholder.com/100" });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Đã thêm " + name + " vào giỏ!");
    
    // Cập nhật badge số lượng
    const badge = document.querySelector('.badge');
    if(badge) {  
        var quantity = cart.reduce((sum, i) => sum + i.quantity, 0);
        
        if (quantity != 0) {
            badge.innerText = quantity;
            badge.style.visibility = "visible";
        }
    }
    // if(badge) badge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// Chạy khi load trang
document.addEventListener('DOMContentLoaded', () => {
    initHomePage();
    
    // Cập nhật số lượng giỏ hàng ngay lập tức
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.badge');
    if(badge) {  
        var quantity = cart.reduce((sum, i) => sum + i.quantity, 0);
        
        if (quantity != 0) {
            badge.innerText = quantity;
            badge.style.visibility = "visible";
        }
    }
    // if(badge) badge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
});