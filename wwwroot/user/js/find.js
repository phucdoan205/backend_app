// API Configuration
const API_BASE = "http://localhost:5062/api";

// --- LOGIC HIỂN THỊ SẢN PHẨM ---
let currentProducts = []; // Biến lưu danh sách đang hiển thị
let allProducts = []; // Tất cả sản phẩm từ API
let categories = []; // Danh sách categories

// Fetch products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        allProducts = await response.json();
        currentProducts = allProducts;
        return allProducts;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Fetch categories from API
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        categories = await response.json();
        renderCategoryFilters();
        return categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
}

// Render category filters dynamically
function renderCategoryFilters() {
    const categoryCheckboxes = document.getElementById('category-checkboxes');
    if (!categoryCheckboxes) return;
    
    if (categories.length === 0) {
        categoryCheckboxes.innerHTML = '<p style="color: #999; font-size: 14px;">Chưa có danh mục</p>';
        return;
    }
    
    categoryCheckboxes.innerHTML = categories.map(category => 
        `<label class="checkbox-item">
            <input type="checkbox" value="${category.id}" data-category="${category.name}"> 
            ${category.name}
        </label>`
    ).join('');
    
    // Add event listeners for category checkboxes
    categoryCheckboxes.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    const countLabel = document.getElementById('total-products');
    
    if (!grid) return; // Nếu không ở trang chủ thì thoát

    // Cập nhật số lượng
    if(countLabel) countLabel.innerText = `Linh Kiện PC (${products.length} sản phẩm)`;

    grid.innerHTML = products.length > 0 ? products.map(p => {
        const categoryName = p.categoryName || 'Chưa phân loại';
        return `
            <div class="product-card">
                <div class="category">${categoryName}</div>
                <h3>${p.name}</h3>
                <div class="price">${Number(p.price).toLocaleString()} đ</div>
                <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        `;
    }).join('') : '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Không tìm thấy sản phẩm nào</p>';
}

// --- TÍNH NĂNG TÌM KIẾM ---
function handleSearch() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    
    // Lọc theo tên
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(keyword) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(keyword))
    );
    currentProducts = filtered;
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

// --- TÍNH NĂNG LỌC GIÁ VÀ CATEGORY ---
function applyFilters() {
    const min = document.getElementById('min-price').value;
    const max = document.getElementById('max-price').value;
    
    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('.filter-section input[type="checkbox"][data-category]:checked'))
        .map(cb => parseInt(cb.value));
    
    let filtered = [...allProducts];
    
    // Filter by price
    if (min) filtered = filtered.filter(p => p.price >= parseFloat(min));
    if (max) filtered = filtered.filter(p => p.price <= parseFloat(max));
    
    // Filter by category
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => p.categoriesID && selectedCategories.includes(p.categoriesID));
    }
    
    currentProducts = filtered;
    renderProducts(filtered);
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

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(x => x.id === id);
    if(exist) {
        exist.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm ${name} vào giỏ hàng!`);
    
    // Cập nhật badge số lượng
    const badge = document.querySelector('.badge');
    if(badge) badge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// --- KHỞI CHẠY KHI TRANG LOAD ---
// Đảm bảo chạy sau khi HTML đã tải xong
document.addEventListener('DOMContentLoaded', async () => {
    checkLoginStatus();
    await loadCategories();
    await loadProducts();
    
    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');
    const categoryName = urlParams.get('category');
    
    if (categoryId) {
        // Filter by category ID
        const categoryIdNum = parseInt(categoryId);
        currentProducts = allProducts.filter(p => p.categoriesID === categoryIdNum);
        // Check the corresponding checkbox
        const checkbox = document.querySelector(`input[type="checkbox"][value="${categoryId}"]`);
        if (checkbox) checkbox.checked = true;
    } else if (categoryName) {
        // Filter by category name
        const category = categories.find(c => c.name === decodeURIComponent(categoryName));
        if (category) {
            currentProducts = allProducts.filter(p => p.categoriesID === category.id);
            const checkbox = document.querySelector(`input[type="checkbox"][value="${category.id}"]`);
            if (checkbox) checkbox.checked = true;
        } else {
            // Fallback: filter by category name in product
            currentProducts = allProducts.filter(p => p.categoryName === decodeURIComponent(categoryName));
        }
    }
    
    renderProducts(currentProducts);
    
    // Cập nhật số lượng giỏ hàng
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.badge');
    if(badge) badge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
});

