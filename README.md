Ứng Dụng E-COMMERCE ĐỒ ÁN CUỐI KÌ
Đây là một hệ thống quản lý bán hàng (E-Commerce) cơ bản, được phát triển nhằm đáp ứng các yêu cầu của bài thi cuối kì. Ứng dụng này tập trung vào việc triển khai mô hình Full-stack với bảo mật và logic nghiệp vụ chặt chẽ.

1. 🌟 Giới Thiệu Ứng Dụng
Ứng dụng được xây dựng trên kiến trúc Client-Server, đảm bảo tính bảo mật bằng cơ chế JSON Web Token (JWT) và thực thi cơ chế Phân quyền theo vai trò (Role-based Authorization).

Chức năng chính:
Quản lý dữ liệu: Hỗ trợ đầy đủ các thao tác CRUD (Create, Read, Update, Delete) cho các đối tượng cốt lõi: Sản phẩm (Product), Khách hàng (Customer), và Đơn hàng (Order/OrderDetail).

Bảo mật: Các endpoint nhạy cảm (như xóa sản phẩm/khách hàng) được bảo vệ, chỉ vai trò Admin mới có quyền truy cập. Khách hàng (User) chỉ được phép xem sản phẩm và tạo đơn hàng của chính mình.

Logic Nghiệp vụ: Backend xử lý kiểm tra tồn kho và giảm số lượng tồn kho ngay khi đơn hàng được tạo.

Giao diện: Front-end cung cấp các trang Đăng nhập, Quản lý Sản phẩm (Admin), và Tạo Đơn hàng (với tính năng Giỏ hàng đơn giản).

2. 🛠️ Công Nghệ Nền tảng
Back-end: ASP.NET Core 8.0 Web API, Entity Framework Core (SQL Server).

Front-end: HTML5, CSS3, JavaScript thuần (Vanilla JS).

3. 🚀 Hướng Dẫn Khởi Động Hệ Thống
Để chạy hệ thống thành công, bạn cần khởi động cả dịch vụ Back-end và ứng dụng Front-end.

3.1. Khởi động Back-end (ECommerceApi)
Chuẩn bị Database: Đảm bảo SQL Server đang hoạt động và Database theo cấu hình trong appsettings.json đã được tạo sẵn (vì bạn không dùng Migrations).

Chạy API: Mở Terminal tại thư mục dự án Back-end và sử dụng lệnh dotnet run. API sẽ khởi động và lắng nghe ở cổng localhost

Lưu ý: Khi khởi động, hệ thống sẽ tự động tạo Roles (Admin, User) và tài khoản Admin mẫu.

Thông tin đăng nhập Admin mẫu: Email: admin, Mật khẩu: 123.

3.2. Khởi động Front-end (ECommerceClient)
Kiểm tra kết nối: Đảm bảo file app.js đang trỏ đến đúng địa chỉ API Backend (localhost).

Mở ứng dụng: Mở trực tiếp file index.html trong thư mục Front-end bằng bất kỳ trình duyệt web nào.

Sử dụng: Sau khi mở, hãy điều hướng đến trang Đăng nhập (#login) để bắt đầu sử dụng chức năng Quản lý Sản phẩm hoặc Tạo Đơn hàng.


CÀI ĐẶT CÁC GÓI CẦN THIẾT

Asp.NetCore hosting Bundle:          https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/8.0.22/dotnet-hosting-8.0.22-win.exe
Net 8.0:                             https://dotnet.microsoft.com/en-us/download/dotnet/8.0
Rewrite module 2.0:                  https://www.iis.net/downloads/microsoft/url-rewrite
