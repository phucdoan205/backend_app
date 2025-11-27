// Hàm khởi tạo Chart
async function initDashboard() {
    await loadKPIStats();
    await loadRevenueChart();
}

// 1. Load số liệu cho 4 thẻ KPI
async function loadKPIStats() {
    try {
        const response = await fetch(`${API_BASE}/reports/stats`);
        if (!response.ok) return;
        const data = await response.json();

        // Cập nhật giao diện (Bạn cần gán ID cho các thẻ <p> trong HTML để code này chạy đúng)
        // Ví dụ: <p class="kpi-value" id="kpiRevenue">...</p>
        
        // Cách tạm thời: Tìm theo class và thứ tự (Nếu bạn chưa sửa ID trong HTML)
        const values = document.querySelectorAll('.kpi-value');
        if(values.length >= 4) {
            values[0].innerText = Number(data.revenue).toLocaleString() + 'đ'; // Doanh thu
            values[1].innerText = data.newOrders; // Đơn mới
            values[2].innerText = data.products;  // Sản phẩm
            values[3].innerText = data.users;     // Khách hàng
        }

    } catch (error) {
        console.error("Lỗi load KPI:", error);
    }
}

// 2. Vẽ biểu đồ doanh thu
async function loadRevenueChart() {
    try {
        const response = await fetch(`${API_BASE}/reports/revenue-7-days`);
        if (!response.ok) return;
        
        const data = await response.json();

        // Chuẩn bị dữ liệu cho Chart.js
        // Format ngày tháng cho đẹp (DD/MM)
        const labels = data.map(item => {
            const date = new Date(item.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        
        const values = data.map(item => item.total);

        // Cấu hình Chart
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line', // Loại biểu đồ: Đường
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh Thu (VNĐ)',
                    data: values,
                    borderColor: '#f97316', // Màu cam chủ đạo
                    backgroundColor: 'rgba(249, 115, 22, 0.2)', // Màu nền mờ dưới đường
                    borderWidth: 3,
                    tension: 0.4, // Độ cong của đường (0 là thẳng tắp)
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // Format tiền tệ trục Y
                            callback: function(value) {
                                return value.toLocaleString() + 'đ';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });

    } catch (error) {
        console.error("Lỗi vẽ biểu đồ:", error);
    }
}

// Chạy ngay khi load trang
document.addEventListener('DOMContentLoaded', initDashboard);