// js/home.js

const API_BASE = "http://localhost:5062/api";
let dbProducts = [];
let categories = [];

// Hàm render sản phẩm dùng chung
function createProductCard(p) {
    const categoryName = p.categoryName || 'Chưa phân loại';
    return `
        <div class="product-card">
            <div class="category">${categoryName}</div>
            <h3 onclick="goToShop('${categoryName}')">${p.name}</h3>
            <div class="price">${Number(p.price).toLocaleString()}đ</div>
            <button onclick="quickAdd(${p.id}, '${p.name}', ${p.price})">
                <i class="fas fa-cart-plus"></i> Thêm
            </button>
        </div>
    `;
}

// Fetch products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        dbProducts = await response.json();
        return dbProducts;
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
        return categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
}

// Render các Section
async function initHomePage() {
    // Load dữ liệu từ API
    await loadProducts();
    
    if (dbProducts.length === 0) {
        console.warn('No products found');
        return;
    }

    // 1. Render Flash Sale (lấy 5 sản phẩm cuối)
    const flashSaleContainer = document.getElementById('flash-sale-grid');
    const saleItems = dbProducts.slice(-5);
    if (flashSaleContainer) {
        flashSaleContainer.innerHTML = saleItems.map(p => createProductCard(p)).join('');
    }

    // 2. Render PC Gaming (tìm category có tên chứa "PC")
    const pcContainer = document.getElementById('pc-grid');
    if (pcContainer) {
        const pcCategory = categories.find(c => c.name && c.name.toUpperCase().includes('PC'));
        const pcItems = pcCategory 
            ? dbProducts.filter(p => p.categoriesID === pcCategory.id)
            : dbProducts.filter(p => p.categoryName && p.categoryName.toUpperCase().includes('PC'));
        pcContainer.innerHTML = pcItems.length > 0 
            ? pcItems.map(p => createProductCard(p)).join('')
            : '<p>Chưa có sản phẩm</p>';
    }

    // 3. Render VGA
    const vgaContainer = document.getElementById('vga-grid');
    if (vgaContainer) {
        const vgaCategory = categories.find(c => c.name && c.name.toUpperCase().includes('VGA'));
        const vgaItems = vgaCategory 
            ? dbProducts.filter(p => p.categoriesID === vgaCategory.id)
            : dbProducts.filter(p => p.categoryName && p.categoryName.toUpperCase().includes('VGA'));
        vgaContainer.innerHTML = vgaItems.length > 0 
            ? vgaItems.map(p => createProductCard(p)).join('')
            : '<p>Chưa có sản phẩm</p>';
    }

    // 4. Render Laptop
    const laptopContainer = document.getElementById('laptop-grid');
    if (laptopContainer) {
        const laptopCategory = categories.find(c => c.name && c.name.toUpperCase().includes('LAPTOP'));
        const laptopItems = laptopCategory 
            ? dbProducts.filter(p => p.categoriesID === laptopCategory.id)
            : dbProducts.filter(p => p.categoryName && p.categoryName.toUpperCase().includes('LAPTOP'));
        laptopContainer.innerHTML = laptopItems.length > 0 
            ? laptopItems.map(p => createProductCard(p)).join('')
            : '<p>Chưa có sản phẩm</p>';
    }
}

// Xử lý Click chuyển hướng
function goToShop(categoryName) {
    // Tìm category ID từ tên
    const category = categories.find(c => c.name === categoryName);
    if (category) {
        // Chuyển sang trang find với filter category
        window.location.href = `find/index.html?categoryId=${category.id}`;
    } else {
        // Fallback: chuyển sang trang find với tên category
        window.location.href = `find/index.html?category=${encodeURIComponent(categoryName)}`;
    }
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
    if(badge) badge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// Chạy khi load trang
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await initHomePage();
    
    // Cập nhật số lượng giỏ hàng ngay lập tức
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.badge');
    if(badge) badge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
});