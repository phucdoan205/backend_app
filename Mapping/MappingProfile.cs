using AutoMapper;
using BackendApp.Models;
using BackendApp.DTOs;

namespace BackendApp.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<Customer, CustomerDTO>().ReverseMap();
            CreateMap<OrderCreateDTO, Order>()
                .ForMember(dest => dest.OrderDetails, opt => opt.Ignore())
                .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
                .ForMember(dest => dest.CreateDate, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());
            CreateMap<OrderItemDTO, OrderDetail>()
                .ForMember(dest => dest.UnitPrice, opt => opt.Ignore())
                .ForMember(dest => dest.OrderId, opt => opt.Ignore());
        }
    }
}
