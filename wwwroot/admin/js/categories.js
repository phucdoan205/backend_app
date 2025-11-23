// js/categories.js – Quản lý Categories với API
// API_BASE được định nghĩa trong config.js

let adminCategories = []; // Đổi tên để tránh conflict

// ========== LOAD CATEGORIES TỪ API ==========
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        adminCategories = await response.json();
        renderCategories();
        return adminCategories;
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Không thể tải danh sách danh mục. Vui lòng thử lại.');
        return [];
    }
}

// ========== RENDER CATEGORIES VÀO BẢNG ==========
function renderCategories() {
    const tbody = document.querySelector('#categoryTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (adminCategories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:40px;">Chưa có danh mục nào</td></tr>';
        return;
    }
    
    adminCategories.forEach(cat => {
        tbody.innerHTML += `
            <tr>
                <td class="product-table_id">${cat.id}</td>
                <td>${cat.name}</td>
                <td>${cat.description || '-'}</td>
                <td style="text-align:center;">
                    <button class="btn-action-edit" onclick="openEditCategoryModal(${cat.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>`;
    });
}

// ========== CÁC HÀM TOÀN CỤC ==========
window.openAddCategoryModal = function () {
    document.getElementById('categoryModalTitle').textContent = 'Thêm Danh Mục Mới';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryDetailId').textContent = '-';
    document.getElementById('categoryDetailName').textContent = '-';
    document.getElementById('btnDeleteCategory').style.display = 'none';
    document.getElementById('categoryModal').style.display = 'block';
};

window.openEditCategoryModal = function (id) {
    const cat = adminCategories.find(x => x.id === id);
    if (!cat) {
        alert('Không tìm thấy danh mục!');
        return;
    }
    
    document.getElementById('categoryModalTitle').textContent = 'Chi Tiết & Chỉnh Sửa Danh Mục';
    document.getElementById('categoryId').value = cat.id;
    document.getElementById('categoryDetailId').textContent = cat.id;
    document.getElementById('categoryDetailName').textContent = cat.name;
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categoryDescription').value = cat.description || '';
    document.getElementById('btnDeleteCategory').style.display = 'block';
    document.getElementById('categoryModal').style.display = 'block';
};

window.deleteCategory = async function (id) {
    if (!confirm('Xóa danh mục này thật nhé? Không thể hoàn tác!')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/categories/${id}`, {
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
        await loadCategories();
        document.getElementById('categoryModal').style.display = 'none';
        
        // Reload categories trong products.js để cập nhật dropdown
        if (typeof loadCategoriesForProducts === 'function') {
            await loadCategoriesForProducts();
        }
        
        // Reload products để cập nhật category dropdown
        if (typeof loadProducts === 'function') {
            await loadProducts();
        } else if (window.loadProducts) {
            await window.loadProducts();
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Lỗi: ' + error.message);
    }
};

// ========== LƯU FORM (THÊM HOẶC SỬA) ==========
document.addEventListener('DOMContentLoaded', async () => {
    // Load categories khi trang load
    await loadCategories();
    
    // Xử lý submit form
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.onsubmit = async function (e) {
            e.preventDefault();
            
            const id = document.getElementById('categoryId').value;
            const token = localStorage.getItem('token');
            
            const categoryData = {
                name: document.getElementById('categoryName').value.trim(),
                description: document.getElementById('categoryDescription').value.trim() || null
            };
            
            if (!categoryData.name) {
                return alert('Vui lòng nhập tên danh mục!');
            }
            
            try {
                let response;
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                
                if (id) {
                    // CẬP NHẬT
                    response = await fetch(`${API_BASE}/categories/${id}`, {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify(categoryData)
                    });
                } else {
                    // THÊM MỚI
                    response = await fetch(`${API_BASE}/categories`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(categoryData)
                    });
                }
                
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Thao tác thất bại' }));
                    throw new Error(error.message || 'Thao tác thất bại');
                }
                
                alert(id ? 'Cập nhật thành công!' : 'Thêm danh mục thành công!');
                document.getElementById('categoryModal').style.display = 'none';
                await loadCategories();
                
                // Reload categories trong products.js để cập nhật dropdown
                if (typeof loadCategoriesForProducts === 'function') {
                    await loadCategoriesForProducts();
                }
                
                // Reload products để cập nhật category dropdown
                if (typeof loadProducts === 'function') {
                    await loadProducts();
                } else if (window.loadProducts) {
                    await window.loadProducts();
                }
            } catch (error) {
                console.error('Error saving category:', error);
                alert('Lỗi: ' + error.message);
            }
        };
    }
    
    // Xử lý nút xóa trong modal
    const btnDeleteCategory = document.getElementById('btnDeleteCategory');
    if (btnDeleteCategory) {
        btnDeleteCategory.onclick = function() {
            const id = document.getElementById('categoryId').value;
            if (id) {
                deleteCategory(parseInt(id));
            }
        };
    }
    
    // Đóng modal
    const categoryModal = document.getElementById('categoryModal');
    if (categoryModal) {
        const closeBtn = categoryModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => categoryModal.style.display = 'none';
        }
        
        window.onclick = e => {
            if (e.target === categoryModal) {
                categoryModal.style.display = 'none';
            }
        };
    }
});

