using AutoMapper;
using BackendApp.Models;
using BackendApp.DTOs;

namespace BackendApp.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // entity -> dto
            CreateMap<Product, ProductDTO>();

        // dto -> entity (KHI UPDATE)
            CreateMap<ProductDTO, Product>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()); // QUAN TRỌNG!
            CreateMap<Customer, CustomerDTO>().ReverseMap();
             // Map DTO -> Order
            CreateMap<OrderCreateDTO, Order>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreateDate, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
                .ForMember(dest => dest.OrderDetails, opt => opt.Ignore());

            // Map OrderItemDTO -> OrderDetail
            CreateMap<OrderItemDTO, OrderDetail>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.OrderId, opt => opt.Ignore())
                .ForMember(dest => dest.UnitPrice, opt => opt.Ignore());
        }
    }
}
