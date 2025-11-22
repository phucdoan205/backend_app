USE [ExamBackendDb]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 11/22/2025 8:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Email] [nvarchar](100) NULL,
	[Phone] [nvarchar](50) NULL,
	[Address] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 11/22/2025 8:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NULL,
	[UnitPrice] [decimal](18, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 11/22/2025 8:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CustomerId] [int] NOT NULL,
	[CreateDate] [datetime] NULL,
	[Status] [nvarchar](50) NULL,
	[TotalAmount] [decimal](18, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 11/22/2025 8:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Price] [decimal](18, 2) NULL,
	[Description] [nvarchar](1000) NULL,
	[Stock] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 11/22/2025 8:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](100) NOT NULL,
	[Password] [nvarchar](100) NOT NULL,
	[Role] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Customers] ON 
GO
INSERT [dbo].[Customers] ([Id], [Name], [Email], [Phone], [Address]) VALUES (1, N'Nguyễn Văn Admin', N'admin@example.com', N'0901234567', N'123 Đường Công Nghệ, Quận 1, TP.HCM')
GO
INSERT [dbo].[Customers] ([Id], [Name], [Email], [Phone], [Address]) VALUES (2, N'Trần Thị User A', N'userA@example.com', N'0912345678', N'456 Đường Lập Trình, Quận Bình Thạnh, TP.HCM')
GO
INSERT [dbo].[Customers] ([Id], [Name], [Email], [Phone], [Address]) VALUES (3, N'Lê Văn Khách B', N'khachB@example.com', N'0934567890', N'789 Đường Dữ Liệu, Quận 3, TP.HCM')
GO
INSERT [dbo].[Customers] ([Id], [Name], [Email], [Phone], [Address]) VALUES (4, N'Phạm Thị C', N'phamc@example.com', N'0987654321', N'101 Đường Kết Nối, Quận Thủ Đức, TP.HCM')
GO
SET IDENTITY_INSERT [dbo].[Customers] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderDetails] ON 
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (1, 1, 2, 1, CAST(30.50 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (2, 2, 2, 1, CAST(30.50 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (3, 3, 1, 2, CAST(23.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (4, 4, 3, 1, CAST(23.00 AS Decimal(18, 2)))
GO
SET IDENTITY_INSERT [dbo].[OrderDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[Orders] ON 
GO
INSERT [dbo].[Orders] ([Id], [CustomerId], [CreateDate], [Status], [TotalAmount]) VALUES (1, 1, CAST(N'2025-11-22T11:54:47.840' AS DateTime), N'Pending', CAST(30.50 AS Decimal(18, 2)))
GO
INSERT [dbo].[Orders] ([Id], [CustomerId], [CreateDate], [Status], [TotalAmount]) VALUES (2, 1, CAST(N'2025-11-22T11:54:52.680' AS DateTime), N'Pending', CAST(30.50 AS Decimal(18, 2)))
GO
INSERT [dbo].[Orders] ([Id], [CustomerId], [CreateDate], [Status], [TotalAmount]) VALUES (3, 1, CAST(N'2025-11-22T11:57:27.337' AS DateTime), N'Pending', CAST(46.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Orders] ([Id], [CustomerId], [CreateDate], [Status], [TotalAmount]) VALUES (4, 1, CAST(N'2025-11-22T12:12:28.497' AS DateTime), N'Pending', CAST(23.00 AS Decimal(18, 2)))
GO
SET IDENTITY_INSERT [dbo].[Orders] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 
GO
INSERT [dbo].[Products] ([Id], [Name], [Price], [Description], [Stock]) VALUES (1, N'bánh xe', CAST(23.00 AS Decimal(18, 2)), N'đây là bánh xe nhập từ việt nam', 8)
GO
INSERT [dbo].[Products] ([Id], [Name], [Price], [Description], [Stock]) VALUES (2, N'bu lông', CAST(30.50 AS Decimal(18, 2)), N'thế hệ cũ', 9)
GO
INSERT [dbo].[Products] ([Id], [Name], [Price], [Description], [Stock]) VALUES (3, N'tua vít', CAST(23.00 AS Decimal(18, 2)), N'loại mới', 20)
GO
INSERT [dbo].[Products] ([Id], [Name], [Price], [Description], [Stock]) VALUES (4, N'chíp', CAST(12.45 AS Decimal(18, 2)), N'không có gì', 12)
GO
INSERT [dbo].[Products] ([Id], [Name], [Price], [Description], [Stock]) VALUES (5, N'cd', CAST(12.90 AS Decimal(18, 2)), N'đời mới', 12)
GO
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([Id], [Username], [Password], [Role]) VALUES (1, N'admin', N'admin123', N'Admin')
GO
INSERT [dbo].[Users] ([Id], [Username], [Password], [Role]) VALUES (2, N'user', N'user123', N'User')
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([CustomerId])
REFERENCES [dbo].[Customers] ([Id])
GO
