// js/cart.js (Đã sửa lỗi đồng bộ ID và Type Conversion)

// Khởi chạy khi vào trang
document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

// Hàm render toàn bộ giỏ hàng
function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.getElementById('cart-body');
    const tempTotalEl = document.getElementById('temp-total');
    const finalTotalEl = document.getElementById('final-total');

    if (!tbody) return;

    // ... (Logic giỏ hàng trống) ...
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
                        </div>
                    </div>
                </td>
                <td style="font-weight:bold;">${Number(item.price).toLocaleString()}₫</td>
                <td>
                    <input type="number" class="qty-input" 
                           value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${item.productId}, this.value)"> 
                </td>
                <td style="color: #dc2626; font-weight:bold;">${Number(lineTotal).toLocaleString()}₫</td>
                <td style="text-align:center">
                    <button class="btn-remove" onclick="removeItem(${item.productId})">
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
function updateQuantity(productId, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(p => p.productId === productId); // FIX: Dùng productId

    if (itemIndex > -1) {
        const qty = parseInt(newQty);
        if (qty > 0) {
            cart[itemIndex].quantity = qty;
        } else {
            alert("Số lượng tối thiểu là 1");
            cart[itemIndex].quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartPage(); // Vẽ lại bảng
    }
}

// Hàm xóa sản phẩm
function removeItem(productId) {
    if(confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(p => p.productId !== productId); // FIX: Dùng productId
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartPage();
    }
}


// 1. Mở Modal khi bấm nút Thanh Toán (Giữ nguyên logic kiểm tra login/nonce)
const btnCheckout = document.querySelector('.btn-checkout');
if (btnCheckout) {
    btnCheckout.onclick = async function() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Vui lòng đăng nhập để thanh toán.");
            window.location.href = '/login.html';
            return;
        }

        // Lấy token dùng 1 lần (Nonce Token)
        const nonceToken = await getCheckoutToken();
        if (!nonceToken) {
            alert("Lỗi bảo mật Nonce Token. Vui lòng thử lại.");
            return;
        }
        
        // Lưu nonce token vào form để lấy sau
        document.getElementById('checkoutForm').setAttribute('data-nonce', nonceToken);
        document.getElementById('checkoutModal').style.display = 'flex';
    };
}

function closeModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// 2. Xử lý khi xác nhận Form
document.getElementById('checkoutForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const payload = parseJwt(token);
    const nonceToken = this.getAttribute('data-nonce');

    // --- 1. KIỂM TRA BẮT BUỘC (Guard Check) ---
    // Kiểm tra Token hợp lệ và Role cho phép
    if (!token || !payload || (payload.role.toUpperCase() !== 'USER' && payload.role.toUpperCase() !== 'ADMIN')) {
        alert("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        window.location.href = '/login.html';
        return;
    }

    // Lấy dữ liệu form
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ép kiểu ID thành số nguyên (Vì DB cần int, và JWT payload.id là string)
    const customerId = parseInt(payload.id);

    // Chuẩn bị dữ liệu gửi lên Server (DTO)
    const orderData = {
        customerId: customerId, // Gửi ID của người dùng đã login
        customerName: name,     // Thông tin người nhận
        customerPhone: phone,
        address: address,
        items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch('http://localhost:5062/api/orders', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Checkout-Token': nonceToken // GỬI TOKEN DÙNG 1 LẦN
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert("Đã gửi thông tin về cho Quản Lý! Cảm ơn bạn đã mua hàng.");
            localStorage.removeItem('cart');
            window.location.href = '../index.html'; 
        } else if (response.status === 400) {
             const errorData = await response.json();
             alert("Lỗi đặt hàng: " + (errorData.message || "Kiểm tra số lượng tồn kho!"));
        } else {
            alert("Lỗi đặt hàng. Vui lòng thử lại!");
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối Server!");
    }
});


// Hàm giải mã JWT để lấy ID
function parseJwt (token) {
    if (!token) return null;
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch(e) {
        return null;
    }
}


// Hàm lấy token tạm thời (Cần API mới trên Backend)
async function getCheckoutToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const res = await fetch(`${API_BASE}/reports/checkout-token`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Could not get checkout token");
        
        const data = await res.json();
        return data.checkoutToken;
    } catch(e) {
        console.error("Lỗi lấy Nonce Token", e);
        return null;
    }
}