const API_BASE = "http://localhost:5062/api";
let dbProducts = [];
let categories = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await initHomePage(); 
    updateCartCount();
});

// 1. Lấy danh mục
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        categories = await res.json();
        console.log("Danh mục tải về:", categories); // Debug
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// 2. Lấy sản phẩm và chia vào các ô
async function initHomePage() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        dbProducts = await res.json();
        console.log("Fetch result:" , dbProducts)

        if (dbProducts.length === 0) return;

        // --- A. FLASH SALE (Lấy 8 sản phẩm ngẫu nhiên hoặc mới nhất) ---
        renderProductSlider('flash-sale-grid', dbProducts.slice(0, 8));

        // --- B. PC GAMING ---
        // Tìm category có tên chứa "PC" hoặc "Mainboard" (tùy dữ liệu của bạn)
        const pcCat = categories.find(c => c.name.toUpperCase().includes("PC") || c.name.toUpperCase().includes("MAINBOARD"));
        if (pcCat) {
            const pcItems = dbProducts.filter(p => p.categoriesID === pcCat.id);
            renderProductSlider('pc-grid', pcItems);
        }

        // --- C. VGA ---
        const vgaCat = categories.find(c => c.name.toUpperCase().includes("VGA"));
        if (vgaCat) {
            const vgaItems = dbProducts.filter(p => p.categoriesID === vgaCat.id);
            renderProductSlider('vga-grid', vgaItems);
        }

        // --- D. LAPTOP ---
        // Nếu chưa có Laptop, mình lấy tạm CPU để test hiển thị
        const laptopCat = categories.find(c => c.name.toUpperCase().includes("LAPTOP") || c.name.toUpperCase().includes("CPU"));
        if (laptopCat) {
            const laptopItems = dbProducts.filter(p => p.categoriesID === laptopCat.id);
            renderProductSlider('laptop-grid', laptopItems);
        }

    } catch (error) {
        console.error('Error init home page:', error);
    }
}

// 3. HÀM VẼ SLIDER
function renderProductSlider(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<p style="padding:20px; color:#fff; text-align:center;">Đang cập nhật sản phẩm...</p>';
        return;
    }

    console.log("===============")
    console.log("Rendering: ", container)
    console.log("Data: ", products)
    console.log("=================")

    const html = `
        <div class="carousel-wrapper">
            <button class="carousel-btn prev" onclick="scrollCarousel('${containerId}', -1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            
            <div class="carousel-track" id="track-${containerId}">
                ${products.map(p => {
                    const cat = categories.find(c => c.id === p.categoriesID);
                    const catName = cat ? cat.name : 'Linh kiện';
                    
                    // SỬA LỖI ẢNH TẠI ĐÂY: Dùng p.imageUrl (chuẩn C#)
                    // Nếu ảnh lỗi hoặc null, dùng ảnh placeholder
                    const imgUrl = p.imagePath || "https://via.placeholder.com/300x300.png?text=No+Image";
                    
                    return `
                    <div class="product-card">
                        <div class="category">${catName}</div>
                        
                        <div class="img-container">
                             <img src="${imgUrl}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300.png?text=Error'">
                        </div>

                        <h3 onclick="alert('Xem chi tiết ID: ${p.id}')" title="${p.name}">
                            ${p.name}
                        </h3>
                        
                        <div class="price">${Number(p.price).toLocaleString()}đ</div>
                        
                        <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.imagePath}')">
                            <i class="fas fa-cart-plus"></i> Thêm
                        </button>
                    </div>
                    `;
                }).join('')}
            </div>

            <button class="carousel-btn next" onclick="scrollCarousel('${containerId}', 1)">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;

    container.innerHTML = html;
}

function scrollCarousel(containerId, direction) {
    const track = document.getElementById(`track-${containerId}`);
    if (track) {
        track.scrollBy({ left: direction * 240, behavior: 'smooth' });
    }
}

// ... (Giữ nguyên các hàm addToCart, updateCartCount bên dưới) ...
function addToCart(id, name, price, image) {
    // ... Code cũ ...
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existItem = cart.find(x => x.id == id); //Loi o dong nay
    console.log(cart[0])
    // console.log(existItem)
    if (existItem) {
        existItem.quantity += 1;
    } else {
        cart.push({id: id, name: name, price: price, quantity: 1, image: image});
        updateCartCount(cart);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Đã thêm " + name + " vào giỏ hàng!");
}

function updateCartCount(currentCart = undefined) {
    let total = 0
    if (currentCart){
        console.log("Total: ", total)
        // total = currentCart.reduce((sum, item) => sum + item.quantity, 0);
        total = currentCart.length || 0
    } else {
        // console.log("Load from DOMLoaded.")
        currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        // console.log(currentCart)
        // total = currentCart.reduce((sum, item) => sum + item.quantity, 0);
        total = currentCart.length || 0
    }
    const badge = document.querySelector('.badge'); 
    if (badge) badge.innerText = total;
}

const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Chặn thẻ a chuyển trang

            if (confirm("Bạn chắc chắn muốn đăng xuất?")) {
                // Xóa sạch sành sanh mọi thứ
                localStorage.removeItem('token');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('role');
                localStorage.removeItem('cart'); // Xóa giỏ hàng (tùy chọn)
                
                // Chuyển hướng về trang Login
                window.location.href = '../login.html';
            }
        });
    }