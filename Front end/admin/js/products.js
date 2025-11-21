// js/products.js – ĐÃ FIX LỖI THÊM SẢN PHẨM + LƯU LOCALSTORAGE HOÀN CHỈNH
console.log('Phiên bản hoàn chỉnh – thêm/sửa/xóa + lưu localStorage');

let products = JSON.parse(localStorage.getItem('pcMasterProducts')) || [
  { id: 1, name: "Chuột Logitech G Pro X Superlight 2", category: "GEAR", price: 3990000, stock: 15 },
  { id: 2, name: "Màn hình LG UltraGear 27GP850-B 2K 165Hz", category: "SCREEN", price: 8990000, stock: 8 },
  { id: 3, name: "Bàn phím Keychron K2 Wireless", category: "GEAR", price: 2190000, stock: 25 },
  { id: 4, name: "SSD Samsung 990 PRO 1TB", category: "SSD", price: 3290000, stock: 42 },
  { id: 5, name: "Tai nghe HyperX Cloud Alpha S", category: "GEAR", price: 2490000, stock: 30 },
  { id: 6, name: "Card RTX 4070 Ti ASUS TUF Gaming", category: "OTHER", price: 24500000, stock: 5 }
];

function saveToLocal() {
  localStorage.setItem('pcMasterProducts', JSON.stringify(products));
}

function loadProducts() {
  const tbody = document.querySelector('#productTable tbody');
  tbody.innerHTML = '';
  products.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.price.toLocaleString()}₫</td>
        <td>${p.stock}</td>
        <td style="text-align:center;">
          <button class="btn-action-edit" onclick="editProduct(${p.id})">Sửa</button>
          <button class="btn-delete-edit" onclick="deleteProduct(${p.id})" >Xóa</button>
      </tr>`;
  });
}

// ========== CÁC HÀM TOÀN CỤC ==========
window.openAddProductModal = function () {
  document.getElementById('modalTitle').textContent = 'Thêm Sản Phẩm Mới';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productModal').style.display = 'block';
};

window.editProduct = function (id) {
  const p = products.find(x => x.id === id);
  document.getElementById('modalTitle').textContent = 'Sửa Sản Phẩm';
  document.getElementById('productId').value = p.id;
  document.getElementById('productName').value = p.name;
  document.getElementById('category').value = p.category;
  document.getElementById('price').value = p.price;
  document.getElementById('stock').value = p.stock;
  document.getElementById('productModal').style.display = 'block';
};

window.deleteProduct = function (id) {
  if (confirm('Xóa sản phẩm này thật nhé? Không thể hoàn tác!')) {
    products = products.filter(x => x.id !== id);
    saveToLocal();
    alert('Đã xóa thành công!');
    loadProducts();
  }
};

// ========== LƯU FORM (THÊM HOẶC SỬA) – ĐÃ SỬA LỖI ==========
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('productForm').onsubmit = function (e) {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const newData = {
      id: id ? Number(id) : Date.now(),   // ID mới nếu thêm
      name: document.getElementById('productName').value.trim(),
      category: document.getElementById('category').value,
      price: Number(document.getElementById('price').value),
      stock: Number(document.getElementById('stock').value)
    };

    if (!newData.name || !newData.category || newData.price <= 0 || newData.stock < 0) {
      return alert('Vui lòng nhập đầy đủ và đúng thông tin!');
    }

    if (id) {
      // SỬA
      products = products.map(p => p.id === newData.id ? newData : p);
      alert('Cập nhật thành công!');
    } else {
      // THÊM MỚI – ĐÃ SỬA LỖI Ở ĐÂY
      products.push(newData);
      alert('Thêm sản phẩm thành công!');
    }

    saveToLocal();   // lưu vào localStorage
    document.getElementById('productModal').style.display = 'none';
    loadProducts();
  };

  // Đóng modal
  document.querySelectorAll('.close').forEach(el => {
    el.onclick = () => el.closest('.modal').style.display = 'none';
  });
  window.onclick = e => {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
  };

  loadProducts(); // load ngay khi mở trang
});