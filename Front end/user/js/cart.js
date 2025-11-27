// js/cart.js

// Hàm render toàn bộ giỏ hàng
function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.getElementById('cart-body');
    const tempTotalEl = document.getElementById('temp-total');
    const finalTotalEl = document.getElementById('final-total');

    if (!tbody) return;

    // Nếu giỏ hàng trống
    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px;">Giỏ hàng trống! <a href="index.html">Mua ngay</a></td></tr>`;
        tempTotalEl.innerText = "0₫";
        finalTotalEl.innerText = "0₫";
        return;
    }

    let totalAmount = 0;

    // Tạo HTML cho từng dòng
    tbody.innerHTML = cart.map((item, index) => {
        const lineTotal = item.price * item.quantity;
        totalAmount += lineTotal;

        return `
            <tr>
                <td>
                    <div class="product-col">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <span style="font-size:12px; color:#888">Mã SP: ${item.id}</span>
                        </div>
                    </div>
                </td>
                <td style="font-weight:bold;">${Number(item.price).toLocaleString()}₫</td>
                <td>
                    <input type="number" class="qty-input" 
                           value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${item.id}, this.value)">
                </td>
                <td style="color: #dc2626; font-weight:bold;">${Number(lineTotal).toLocaleString()}₫</td>
                <td style="text-align:center">
                    <button class="btn-remove" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Cập nhật tổng tiền
    tempTotalEl.innerText = Number(totalAmount).toLocaleString() + "₫";
    finalTotalEl.innerText = Number(totalAmount).toLocaleString() + "₫";
}

// Hàm cập nhật số lượng
function updateQuantity(id, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(p => p.id === id);

    if (itemIndex > -1) {
        const qty = parseInt(newQty);
        if (qty > 0) {
            cart[itemIndex].quantity = qty;
        } else {
            // Nếu nhập số <= 0 thì coi như xóa hoặc reset về 1 (ở đây mình reset về 1)
            alert("Số lượng tối thiểu là 1");
            cart[itemIndex].quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartPage(); // Vẽ lại bảng
    }
}

// Hàm xóa sản phẩm
function removeItem(id) {
    if(confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(p => p.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartPage();
        // Cập nhật lại badge số lượng trên menu (nếu có script chung)
    }
}

// Khởi chạy khi vào trang
document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});