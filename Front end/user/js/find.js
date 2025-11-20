// Dữ liệu mẫu mở rộng (Để giao diện trông đầy đặn như ảnh)
const initialProducts = [
    { id: 1, name: "NVIDIA RTX 4090 Founders Edition", category: "GPU", brand: "NVIDIA", price: 45000000 },
    { id: 2, name: "Intel Core i9-13900K", category: "CPU", brand: "Intel", price: 14500000 },
    { id: 3, name: "RAM Corsair Vengeance 32GB", category: "RAM", brand: "Corsair", price: 2500000 },
    { id: 4, name: "Mainboard ASUS ROG Z790", category: "Mainboard", brand: "Asus", price: 8900000 },
    { id: 5, name: "AMD Ryzen 9 7950X", category: "CPU", brand: "AMD", price: 13200000 },
    { id: 6, name: "NVIDIA RTX 3060 Ti", category: "GPU", brand: "NVIDIA", price: 9500000 },
    { id: 7, name: "RAM G.Skill Trident Z 16GB", category: "RAM", brand: "G.Skill", price: 1800000 },
    { id: 8, name: "SSD Samsung 980 Pro 1TB", category: "SSD", brand: "Samsung", price: 2100000 }
];

// Lấy dữ liệu từ LocalStorage hoặc dùng mẫu
function getProducts() {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : initialProducts;
}

// --- LOGIC HIỂN THỊ SẢN PHẨM ---
let currentProducts = getProducts(); // Biến lưu danh sách đang hiển thị

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    const countLabel = document.getElementById('total-products');
    
    if (!grid) return; // Nếu không ở trang chủ thì thoát

    // Cập nhật số lượng
    if(countLabel) countLabel.innerText = `Linh Kiện PC (${products.length} sản phẩm)`;

    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="category">${p.brand} | ${p.category}</div>
            <h3>${p.name}</h3>
            <div class="price">${Number(p.price).toLocaleString()} đ</div>
            <button onclick="addToCart('${p.name}')">
                <i class="fas fa-cart-plus"></i> Thêm vào giỏ
            </button>
        </div>
    `).join('');
}

// --- TÍNH NĂNG TÌM KIẾM ---
function handleSearch() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const allProducts = getProducts();
    
    // Lọc theo tên
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
}

// --- TÍNH NĂNG SẮP XẾP ---
function sortProducts(type) {
    let sorted = [...currentProducts]; // Copy mảng để không ảnh hưởng gốc
    if (type === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (type === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
    } else if (type === 'name-asc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    renderProducts(sorted);
}

// --- TÍNH NĂNG LỌC GIÁ ---
function applyFilters() {
    const min = document.getElementById('min-price').value;
    const max = document.getElementById('max-price').value;
    
    let allProducts = getProducts();
    
    if (min) allProducts = allProducts.filter(p => p.price >= min);
    if (max) allProducts = allProducts.filter(p => p.price <= max);
    
    currentProducts = allProducts;
    renderProducts(allProducts);
}

// --- CHECK LOGIN (Để hiển thị Header đúng) ---
function checkLoginStatus() {
    const userInfoDiv = document.getElementById('user-info');
    if (!userInfoDiv) return;

    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        userInfoDiv.innerHTML = `
            <span>Xin chào, <b>${user.username}</b></span>
            ${user.role === 'ADMIN' ? '<a href="admin/index.html" style="color: yellow; margin-left:10px">Quản lý</a>' : ''}
            <span onclick="logout()" style="color: #ef4444; margin-left: 10px;">[Đăng xuất]</span>
        `;
    } else {
        userInfoDiv.innerHTML = `<a href="login.html"><b>Đăng nhập / Đăng ký</b></a>`;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function addToCart(name) {
    alert(`Đã thêm ${name} vào giỏ hàng!`);
}

// --- KHỞI CHẠY KHI TRANG LOAD ---
// Đảm bảo chạy sau khi HTML đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    renderProducts(currentProducts);
});

