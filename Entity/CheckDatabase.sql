-- Script kiểm tra xem database đã đầy đủ chưa
USE [ExamBackendDb]
GO

PRINT '=== KIỂM TRA DATABASE ==='
PRINT ''

-- 1. Kiểm tra table Categories
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
BEGIN
    PRINT '✓ Table Categories đã tồn tại'
    
    -- Kiểm tra số lượng records
    DECLARE @CategoryCount INT
    SELECT @CategoryCount = COUNT(*) FROM [dbo].[Categories]
    PRINT '  - Số lượng categories: ' + CAST(@CategoryCount AS VARCHAR(10))
    
    IF @CategoryCount = 0
        PRINT '  ⚠ WARNING: Table Categories trống, cần thêm dữ liệu!'
    ELSE
        PRINT '  ✓ Có dữ liệu trong Categories'
END
ELSE
BEGIN
    PRINT '✗ Table Categories CHƯA tồn tại - CẦN chạy AddCategoriesTable.sql'
END
GO

-- 2. Kiểm tra cột CategoriesID trong Products
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND name = 'CategoriesID')
BEGIN
    PRINT '✓ Cột CategoriesID đã có trong table Products'
    
    -- Kiểm tra số products có CategoriesID
    DECLARE @ProductsWithCategory INT
    SELECT @ProductsWithCategory = COUNT(*) FROM [dbo].[Products] WHERE CategoriesID IS NOT NULL
    PRINT '  - Số products có category: ' + CAST(@ProductsWithCategory AS VARCHAR(10))
END
ELSE
BEGIN
    PRINT '✗ Cột CategoriesID CHƯA có trong Products - CẦN chạy AddCategoriesTable.sql'
END
GO

-- 3. Kiểm tra Foreign Key constraint
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Products_Categories')
BEGIN
    PRINT '✓ Foreign Key constraint FK_Products_Categories đã tồn tại'
END
ELSE
BEGIN
    PRINT '✗ Foreign Key constraint CHƯA có - CẦN chạy AddCategoriesTable.sql'
END
GO

PRINT ''
PRINT '=== KẾT LUẬN ==='
PRINT 'Nếu có dấu ✗ hoặc ⚠, hãy chạy AddCategoriesTable.sql để sửa!'
GO


