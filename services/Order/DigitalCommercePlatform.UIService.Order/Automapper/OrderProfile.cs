using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIService.Order.Models.Order;

namespace DigitalCommercePlatform.UIService.Order.AutoMapper
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderModel, OrderDto>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.DocType))
                .ForMember(dest => dest.Price, opt => opt.MapFrom<OrderPriceResolver>());

            CreateMap<Item, OrderLineResponse>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product[0].Name));

        }
    }

    public class OrderPriceResolver : IValueResolver<OrderModel, OrderDto, string>
    {
        public string Resolve(OrderModel source, OrderDto destination, string destMember, ResolutionContext context)
        {
            return $"{source.Price} {source.Currency}";
        }
    }
}