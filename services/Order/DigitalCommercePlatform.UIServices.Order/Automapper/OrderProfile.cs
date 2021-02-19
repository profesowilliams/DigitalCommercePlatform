using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetSingleOrder;
using DigitalCommercePlatform.UIServices.Order.Models.Order;

namespace DigitalCommercePlatform.UIServices.Order.AutoMapper
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

            CreateMap<AddressDetails, AddressDto>();
            CreateMap<OrderModel, SingleOrderResponse>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Address))
                .ForPath(dest => dest.ShipTo.Name, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForPath(dest => dest.PaymentDetails.NetValue, opt => opt.MapFrom(src => src.Price))
                .ForPath(dest => dest.PaymentDetails.Reference, opt => opt.MapFrom(src => src.CustomerPO))
                .ForPath(dest => dest.PaymentDetails.Currency, opt => opt.MapFrom(src => src.Currency))
                .ForPath(dest => dest.Customer, opt => opt.MapFrom(src => src.ShipTo.Name));
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