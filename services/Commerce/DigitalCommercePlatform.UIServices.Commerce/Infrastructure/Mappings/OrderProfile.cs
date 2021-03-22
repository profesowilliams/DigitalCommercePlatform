using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderModel, RecentOrdersModel>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
                .ForMember(dest => dest.Reseller, opt => opt.MapFrom(src => src.CustomerPO))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.DocType))
                .ForMember(dest => dest.Vendor, opt => opt.MapFrom<OrderVendorResolver>())
                .ForMember(dest => dest.Price, opt => opt.MapFrom<OrderPriceResolver>());

            CreateMap<Item, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product[0].Name)); 

            CreateMap<AddressDetails, Address>();
            CreateMap<Item, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product[0].Name)); 
            CreateMap<OrderModel, OrderDetailModel>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Address))
                .ForMember(dest => dest.Lines, opt => opt.MapFrom(src => src.Items))
                .ForPath(dest => dest.ShipTo.Name, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForPath(dest => dest.PaymentDetails.NetValue, opt => opt.MapFrom(src => src.Price))
                .ForPath(dest => dest.PaymentDetails.Reference, opt => opt.MapFrom(src => src.CustomerPO))
                .ForPath(dest => dest.PaymentDetails.Currency, opt => opt.MapFrom(src => src.Currency))
                .ForPath(dest => dest.Reseller.CompanyName, opt => opt.MapFrom(src => src.ShipTo.Name));
        }
    }

    public class OrderPriceResolver : IValueResolver<OrderModel, RecentOrdersModel, string>
    {
        public string Resolve(OrderModel source, RecentOrdersModel destination, string destMember, ResolutionContext context)
        {
            return $"{source.Price} {source.Currency}";
        }
    }

    public class OrderVendorResolver : IValueResolver<OrderModel, RecentOrdersModel, string>
    {
        public string Resolve(OrderModel source, RecentOrdersModel destination, string destMember, ResolutionContext context)
        {
            var theFirstItem = source?.Items?.FirstOrDefault();
            var theFirstProduct = theFirstItem?.Product?.FirstOrDefault();
            var description = theFirstProduct?.Manufacturer ?? string.Empty;
            return description;
        }
    }
}