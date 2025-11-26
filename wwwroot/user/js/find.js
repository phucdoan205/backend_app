// js/find.js

// 1. Cấu hình API
const API_BASE = "http://localhost:5062/api";

// 2. Biến toàn cục lưu dữ liệu
let allProducts = [];      // Chứa toàn bộ sản phẩm từ Server
let currentProducts = [];  // Chứa danh sách đang hiển thị (đã lọc/sort)
let categories = [];       // Danh sách danh mục

// ============================================================
// 3. KHỞI CHẠY KHI TRANG LOAD (Logic quan trọng nhất)
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    checkLoginStatus(); // Kiểm tra đăng nhập header
    await loadCategories();
    await loadProducts(); // Gọi API lấy sản phẩm về
    
    // --- XỬ LÝ TỪ KHÓA TÌM KIẾM TỪ TRANG CHỦ (URL) ---
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('q');           // Lấy chữ ?q=...
    const categoryId = urlParams.get('categoryId'); // Lấy ?categoryId=...

    // Logic lọc dữ liệu ban đầu
    if (keyword) {
        // Nếu có từ khóa tìm kiếm
        document.getElementById('search-input').value = keyword;
        document.querySelector('.sort-bar h2').innerText = `Kết quả tìm kiếm: "${keyword}"`;
        
        // Lọc trong máy khách (Client-side filtering)
        currentProducts = allProducts.filter(p => 
            p.name.toLowerCase().includes(keyword.toLowerCase())
        );
    } 
    else if (categoryId) {
        // Nếu bấm vào banner danh mục
        const catIdNum = parseInt(categoryId);
        currentProducts = allProducts.filter(p => p.categoriesID === catIdNum);
        
        // Tự động tick vào checkbox tương ứng bên trái
        const checkbox = document.querySelector(`input[type="checkbox"][value="${categoryId}"]`);
        if (checkbox) checkbox.checked = true;
    } 
    else {
        // Nếu không có gì thì hiện tất cả
        currentProducts = [...allProducts];
    }
    
    // Vẽ ra màn hình
    renderProducts(currentProducts);
    updateCartCount();
});

// ============================================================
// 4. CÁC HÀM GỌI API (FETCH DATA)
// ============================================================

// Tải danh sách sản phẩm từ Server
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        allProducts = await response.json();
        return allProducts;
    } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        return [];
    }
}

// Tải danh mục từ Server
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        categories = await response.json();
        renderCategoryFilters(); // Vẽ checkbox bên sidebar
    } catch (error) {
        console.error('Lỗi tải danh mục:', error);
    }
}

// ============================================================
// 5. HÀM RENDER GIAO DIỆN
// ============================================================

// Vẽ danh sách sản phẩm ra lưới
function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    const countLabel = document.getElementById('total-products');
    
    if (!grid) return;

    // Cập nhật số lượng tìm thấy
    if(countLabel) countLabel.innerText = `Tìm thấy ${products.length} sản phẩm`;

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px;">Không tìm thấy sản phẩm nào :(</p>';
        return;
    }

    grid.innerHTML = products.map(p => {
        // Tìm tên danh mục
        const cat = categories.find(c => c.id === p.categoriesID);
        const catName = cat ? cat.name : 'Linh kiện';
        const imgUrl = p.imageUrl || "https://via.placeholder.com/300x300?text=No+Image";

        return `
            <div class="product-card">
                <div class="category">${catName}</div>
                <div style="height: 180px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 10px;">
                    <img src="${imgUrl}" alt="${p.name}" style="max-width: 100%; max-height: 100%;">
                </div>
                <h3 onclick="alert('Xem chi tiết ID: ${p.id}')" style="cursor:pointer">${p.name}</h3>
                <div class="price">${Number(p.price).toLocaleString()} đ</div>
                <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        `;
    }).join('');
}

// Vẽ bộ lọc danh mục bên trái
function renderCategoryFilters() {
    const container = document.getElementById('category-checkboxes');
    if (!container) return;
    
    if (categories.length === 0) {
        container.innerHTML = '<p>Đang cập nhật...</p>';
        return;
    }
    
    container.innerHTML = categories.map(cat => 
        `<label class="checkbox-item">
            <input type="checkbox" value="${cat.id}"> ${cat.name}
        </label>`
    ).join('');
}

// ============================================================
// 6. CÁC TÍNH NĂNG: TÌM KIẾM, LỌC, SẮP XẾP
// ============================================================

// Tìm kiếm khi gõ vào ô input ở trang này
function handleSearch() {
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();
    
    // Thay đổi URL để người dùng có thể copy link gửi bạn bè
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('q', keyword);
    window.history.pushState({}, '', newUrl);

    // Lọc dữ liệu
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(keyword)
    );
    
    currentProducts = filtered;
    renderProducts(filtered);
}

// Sắp xếp (Giá tăng, giảm, Tên A-Z)
function sortProducts(type) {
    // Copy mảng để không làm hỏng mảng gốc
    let sorted = [...currentProducts]; 

    if (type === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (type === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
    } else if (type === 'name-asc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Render lại danh sách đã sắp xếp
    renderProducts(sorted);
}

// Nút Áp dụng bộ lọc (Giá + Danh mục)
function applyFilters() {
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    
    // Lấy danh sách ID các danh mục được tích chọn
    const checkedBoxes = document.querySelectorAll('#category-checkboxes input:checked');
    const selectedCatIds = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
    
    // Bắt đầu lọc từ danh sách gốc
    let result = allProducts;

    // 1. Lọc theo giá
    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));

    // 2. Lọc theo danh mục (nếu có chọn)
    if (selectedCatIds.length > 0) {
        result = result.filter(p => selectedCatIds.includes(p.categoriesID));
    }

    currentProducts = result;
    renderProducts(result);
}

// ============================================================
// 7. CÁC HÀM HỖ TRỢ (AUTH, CART)
// ============================================================

function checkLoginStatus() {
    const userInfoDiv = document.getElementById('user-info');
    if (!userInfoDiv) return;

    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        userInfoDiv.innerHTML = `
            <span>Xin chào, <b>${user.username}</b></span>
            ${user.role === 'ADMIN' ? '<a href="/admin/index.html" style="color: yellow; margin-left:10px">Quản lý</a>' : ''}
            <span onclick="logout()" style="color: #ef4444; margin-left: 10px; cursor:pointer;">[Đăng xuất]</span>
        `;
    } else {
        userInfoDiv.innerHTML = `<a href="/login.html"><b>Đăng nhập / Đăng ký</b></a>`;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/login.html';
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(x => x.productId === id);
    if(exist) {
        exist.quantity++;
    } else {
        cart.push({ productId: id, name: name, price: price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm ${name} vào giỏ hàng!`);
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.badge');
    if(badge) badge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
}
