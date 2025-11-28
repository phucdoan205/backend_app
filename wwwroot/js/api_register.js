document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPass = document.getElementById('regConfirmPass').value;
            
            const messageEl = document.getElementById('regMessage');
            const btnRegister = document.getElementById('btnRegister');

            // Reset thông báo
            messageEl.textContent = "";
            messageEl.style.color = "red";

            // Validate cơ bản
            if (password !== confirmPass) {
                messageEl.textContent = "Mật khẩu nhập lại không khớp!";
                return;
            }

            if (password.length < 3) {
                messageEl.textContent = "Mật khẩu phải có ít nhất 3 ký tự!";
                return;
            }

            // Bắt đầu gọi API
            btnRegister.disabled = true; // Khóa nút để tránh bấm nhiều lần
            btnRegister.textContent = "Đang xử lý...";

            try {
                // API_BASE lấy từ file js/config.js
                const response = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, email })
                });

                const data = await response.json();

                if (response.ok) {
                    // --- THÀNH CÔNG ---
                    messageEl.style.color = "green"; // Chuyển chữ thành màu xanh
                    messageEl.innerHTML = `✅ Đăng ký thành công!<br>Đang chuyển về trang đăng nhập sau 3 giây...`;
                    
                    // Đợi 3 giây rồi chuyển trang
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 3000);

                } else {
                    // --- THẤT BẠI (Lỗi từ server trả về) ---
                    messageEl.textContent = data.message || "Đăng ký thất bại!";
                    btnRegister.disabled = false;
                    btnRegister.textContent = "ĐĂNG KÝ NGAY";
                }
            } catch (err) {
                console.error(err);
                messageEl.textContent = "Lỗi kết nối server!";
                btnRegister.disabled = false;
                btnRegister.textContent = "ĐĂNG KÝ NGAY";
            }
        });