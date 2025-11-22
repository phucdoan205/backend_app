-- Script để thêm table Categories và cập nhật Products table
-- Chạy script này nếu table Categories chưa tồn tại

USE [ExamBackendDb]
GO

-- Tạo table Categories nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Categories](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](100) NULL,
        [Description] [nvarchar](1000) NULL,
    PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    PRINT 'Table Categories đã được tạo thành công!'
END
ELSE
BEGIN
    PRINT 'Table Categories đã tồn tại.'
END
GO

-- Thêm cột CategoriesID vào Products nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND name = 'CategoriesID')
BEGIN
    ALTER TABLE [dbo].[Products]
    ADD [CategoriesID] [int] NULL
    PRINT 'Cột CategoriesID đã được thêm vào table Products!'
END
ELSE
BEGIN
    PRINT 'Cột CategoriesID đã tồn tại trong table Products.'
END
GO

-- Thêm Foreign Key constraint nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Products_Categories')
BEGIN
    ALTER TABLE [dbo].[Products] WITH CHECK 
    ADD CONSTRAINT [FK_Products_Categories] FOREIGN KEY([CategoriesID])
    REFERENCES [dbo].[Categories] ([Id])
    ON DELETE SET NULL
    PRINT 'Foreign Key constraint đã được thêm!'
END
ELSE
BEGIN
    PRINT 'Foreign Key constraint đã tồn tại.'
END
GO

-- Thêm dữ liệu mẫu cho Categories (nếu chưa có)
IF NOT EXISTS (SELECT * FROM [dbo].[Categories])
BEGIN
    SET IDENTITY_INSERT [dbo].[Categories] ON
    INSERT INTO [dbo].[Categories] ([Id], [Name], [Description]) VALUES 
    (1, N'Mainboard', N'Bo mạch chủ'),
    (2, N'CPU', N'Vi xử lý'),
    (3, N'RAM', N'Bộ nhớ RAM'),
    (4, N'VGA', N'Card đồ họa'),
    (5, N'SSD', N'Ổ cứng SSD'),
    (6, N'PC', N'Máy tính để bàn'),
    (7, N'Laptop', N'Máy tính xách tay'),
    (8, N'Gear', N'Phụ kiện'),
    (9, N'Screen', N'Màn hình')
    SET IDENTITY_INSERT [dbo].[Categories] OFF
    PRINT 'Đã thêm dữ liệu mẫu cho Categories!'
END
ELSE
BEGIN
    PRINT 'Categories đã có dữ liệu.'
END
GO

PRINT 'Hoàn tất!'
GO

