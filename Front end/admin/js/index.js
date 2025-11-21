// script.js

// 1. Dữ liệu mẫu (Nếu chưa có trong LocalStorage thì tạo mới)
const initialProducts = [
    { id: 1, name: "NVIDIA RTX 4090", category: "GPU", price: 45000000 },
    { id: 2, name: "Intel Core i9-13900K", category: "CPU", price: 14000000 },
    { id: 3, name: "RAM Corsair 32GB", category: "RAM", price: 3500000 }
];

// Hàm lấy sản phẩm từ Storage
function getProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : initialProducts;
}

// Hàm lưu sản phẩm vào Storage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// --- LOGIC ĐĂNG NHẬP (Login Page) ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;

        // Giả lập API Check Back-end
        if (u === 'admin' && p === '123') {
            const token = "fake-jwt-token-admin";
            const user = { username: 'admin', role: 'ADMIN' };
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'admin/index.html'; // Chuyển trang Admin
        } else if (u === 'user' && p === '123') {
            const token = "fake-jwt-token-user";
            const user = { username: 'user', role: 'USER' };
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'user/shoppingCart/cart.html'; // Chuyển trang User
        } else {
            document.getElementById('error-msg').innerText = "Sai tài khoản hoặc mật khẩu!";
        }
    });
}

// --- LOGIC DÙNG CHUNG: Đăng xuất ---
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// --- LOGIC USER PAGE (index.html) ---
function checkLoginStatus() {
    const userInfoDiv = document.getElementById('user-info');
    if (!userInfoDiv) return;

    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        userInfoDiv.innerHTML = `
            <span>Xin chào, <b>${user.username}</b></span>
            ${user.role === 'ADMIN' ? '<a href="admin.html" style="color: yellow">Vào trang Quản lý</a>' : ''}
            <button onclick="logout()">Đăng xuất</button>
        `;
    } else {
        userInfoDiv.innerHTML = `<a href="login.html">Đăng nhập</a>`;
    }
}

function loadProductsForUser() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const products = getProducts();
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <h3>${p.name}</h3>
            <p>Loại: ${p.category}</p>
            <p class="price">${Number(p.price).toLocaleString()} đ</p>
            <button onclick="alert('Đã thêm ${p.name} vào giỏ!')">Mua Ngay</button>
        </div>
    `).join('');
}

// --- LOGIC ADMIN PAGE (admin.html) ---
function loadProductsForAdmin() {
    const tbody = document.getElementById('admin-product-list');
    if (!tbody) return;

    const products = getProducts();
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${Number(p.price).toLocaleString()}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">Sửa giá</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// CREATE: Thêm sản phẩm
function addProduct() {
    const name = document.getElementById('p-name').value;
    const cat = document.getElementById('p-category').value;
    const price = document.getElementById('p-price').value;

    if (!name || !price) return alert("Vui lòng nhập đủ thông tin!");

    const products = getProducts();
    const newProduct = {
        id: Date.now(), // Tạo ID ngẫu nhiên theo thời gian
        name: name,
        category: cat,
        price: price
    };

    products.push(newProduct);
    saveProducts(products);
    
    // Reset form và load lại bảng
    document.getElementById('p-name').value = "";
    document.getElementById('p-price').value = "";
    loadProductsForAdmin();
}

// DELETE: Xóa sản phẩm
function deleteProduct(id) {
    if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        loadProductsForAdmin();
    }
}

// UPDATE: Sửa giá sản phẩm (Demo đơn giản dùng prompt)
function editProduct(id) {
    let products = getProducts();
    const product = products.find(p => p.id === id);
    
    const newPrice = prompt(`Nhập giá mới cho ${product.name}:`, product.price);
    if (newPrice !== null && newPrice !== "") {
        product.price = newPrice;
        saveProducts(products);
        loadProductsForAdmin();
    }
}