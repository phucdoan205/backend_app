// js/products.js – Quản lý Products với API
// API_BASE được định nghĩa trong config.js

let products = [];
let productCategories = [];

// ========== LOAD DỮ LIỆU TỪ API ==========
async function loadCategoriesForProducts() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        // Cập nhật biến mới
        productCategories = await response.json(); 
        
        renderCategoryOptions();
        return productCategories;
    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}: ${response.statusText}` }));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        products = await response.json();
        console.log('Products loaded:', products);
        renderProducts();
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        const errorMessage = error.message || 'Không thể tải danh sách sản phẩm. Vui lòng thử lại.';
        alert('Lỗi: ' + errorMessage + '\n\nVui lòng kiểm tra:\n1. Backend API đang chạy\n2. Console để xem chi tiết lỗi');
        return [];
    }
}

// Export để có thể gọi từ file khác
window.loadProducts = loadProducts;
window.loadCategoriesForProducts = loadCategoriesForProducts;

// ========== RENDER CATEGORIES VÀO DROPDOWN ==========
function renderCategoryOptions() {
    const categorySelect = document.getElementById('category');
    if (!categorySelect) return;
    
    const firstOption = categorySelect.querySelector('option[value=""]');
    categorySelect.innerHTML = '';
    if (firstOption) {
        categorySelect.appendChild(firstOption);
    } else {
        categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
    }
    
    // Dùng biến mới productCategories để lặp
    productCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}

// ========== RENDER PRODUCTS VÀO BẢNG ==========
function renderProducts() {
    const tbody = document.querySelector('#productTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    products.forEach(p => {
        const categoryName = p.categoryName || 'Chưa phân loại';
        tbody.innerHTML += `
            <tr>
                <td class="product-table_id">${p.id}</td>
                <td>${p.name}</td>
                <td>${categoryName}</td>
                <td>${Number(p.price).toLocaleString()}₫</td>
                <td>${p.stock || 0}</td>
                <td style="text-align:center;">
                    <button class="btn-action-edit" onclick="openEditModal(${p.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>`;
    });
}

// ========== CÁC HÀM TOÀN CỤC ==========
window.openAddProductModal = function () {
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Thêm Sản Phẩm Mới';
    }
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    const detailId = document.getElementById('detailId');
    if (detailId) detailId.textContent = '-';
    const detailName = document.getElementById('detailName');
    if (detailName) detailName.textContent = '-';
    document.getElementById('btnDeleteProduct').style.display = 'none';
    document.getElementById('productModal').style.display = 'block';
};

window.openEditModal = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) {
        alert('Không tìm thấy sản phẩm!');
        return;
    }
    
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-cube"></i> Chi Tiết & Chỉnh Sửa Sản Phẩm';
    }
    document.getElementById('productId').value = p.id;
    const detailId = document.getElementById('detailId');
    if (detailId) detailId.textContent = p.id;
    const detailName = document.getElementById('detailName');
    if (detailName) detailName.textContent = p.name;
    document.getElementById('productName').value = p.name;
    document.getElementById('category').value = p.categoriesID || '';
    document.getElementById('price').value = p.price;
    document.getElementById('stock').value = p.stock || 0;
    document.getElementById('btnDeleteProduct').style.display = 'block';
    document.getElementById('productModal').style.display = 'block';
};

window.deleteProduct = async function (id) {
    if (!confirm('Xóa sản phẩm này thật nhé? Không thể hoàn tác!')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Xóa thất bại' }));
            throw new Error(error.message || 'Xóa thất bại');
        }
        
        alert('Đã xóa thành công!');
        await loadProducts();
        document.getElementById('productModal').style.display = 'none';
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Lỗi: ' + error.message);
    }
};

// ========== LƯU FORM (THÊM HOẶC SỬA) ==========
document.addEventListener('DOMContentLoaded', async () => {
    // Load categories và products khi trang load
    await loadCategoriesForProducts();
    await loadProducts();
    
    // Xử lý submit form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.onsubmit = async function (e) {
            e.preventDefault();
            
            const id = document.getElementById('productId').value;
            const token = localStorage.getItem('token');
            
            const productData = {
                name: document.getElementById('productName').value.trim(),
                categoriesID: document.getElementById('category').value ? parseInt(document.getElementById('category').value) : null,
                price: parseFloat(document.getElementById('price').value),
                stock: parseInt(document.getElementById('stock').value) || 0,
                description: '' // Có thể thêm field description sau
            };
            
            if (!productData.name || !productData.price || productData.price <= 0) {
                return alert('Vui lòng nhập đầy đủ và đúng thông tin!');
            }
            
            try {
                let response;
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                
                if (id) {
                    // CẬP NHẬT
                    response = await fetch(`${API_BASE}/products/${id}`, {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify(productData)
                    });
                } else {
                    // THÊM MỚI
                    response = await fetch(`${API_BASE}/products`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(productData)
                    });
                }
                
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Thao tác thất bại' }));
                    throw new Error(error.message || 'Thao tác thất bại');
                }
                
                alert(id ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
                document.getElementById('productModal').style.display = 'none';
                await loadProducts();
            } catch (error) {
                console.error('Error saving product:', error);
                alert('Lỗi: ' + error.message);
            }
        };
    }
    
    // Xử lý nút xóa trong modal
    const btnDeleteProduct = document.getElementById('btnDeleteProduct');
    if (btnDeleteProduct) {
        btnDeleteProduct.onclick = function() {
            const id = document.getElementById('productId').value;
            if (id) {
                deleteProduct(parseInt(id));
            }
        };
    }
    
    // Đóng modal
    document.querySelectorAll('.close').forEach(el => {
        el.onclick = () => el.closest('.modal').style.display = 'none';
    });
    
    window.onclick = e => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
});
