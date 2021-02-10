using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIService.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Model.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models;
using DigitalCommercePlatform.UIService.Order.Models.Order;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.AutoMapper
{
    [ExcludeFromCodeCoverage]
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<AddressDto, AddressModel>();
            CreateMap<AgreementDto, AgreementModel>();
            CreateMap<DeliveryDto, DeliveryModel>();
            CreateMap<EndUserReferenceDto, EndUserReferenceModel>();
            CreateMap<IdValueDto, IdValueModel>();
            CreateMap<InvoiceDto, InvoiceModel>();
            CreateMap<ItemDto, Models.SalesOrder.Internal.ItemModel>();
            CreateMap<OrderLinkDto, OrderLinkModel>();
            CreateMap<AddressPartyDto, AddressPartyModel>();
            CreateMap<BasePartyDto, BasePartyModel>();
            CreateMap<ContactDto, ContactModel>();
            CreateMap<ContactPartyDto, ContactPartyModel>();
            CreateMap<PayerDto, PayerModel>();
            CreateMap<ProductDto, Models.SalesOrder.Internal.ProductModel>();
            CreateMap<QuoteLinkDto, QuoteLinkModel>();
            CreateMap<ShipmentDto, ShipmentModel>();

            CreateMap<SalesOrderDto, SalesOrderModel>();
            CreateMap<SummaryDto, SummaryModel>();

            CreateMap<FindRequestModel, FindRequestDto>();


            CreateMap<OrderModel, OrderResponse>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.DocType))
                .ForMember(dest => dest.Price, opt => opt.MapFrom<OrderPriceResolver>());

            CreateMap<Item, OrderLineResponse>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product[0].Name));

        }
    }

    public class OrderPriceResolver : IValueResolver<OrderModel, OrderResponse, string>
    {
        public string Resolve(OrderModel source, OrderResponse destination, string destMember, ResolutionContext context)
        {
            return $"{source.Price} {source.Currency}";
        }
    }

    internal static class MapperTypeConversions
    {
        public static long StringToLong(string value)
        {
            if (long.TryParse(value, out long convertedValue) == false)
                return 0;

            return convertedValue;
        }

        public static decimal StringToDecimal(string value)
        {
            if (decimal.TryParse(value, out decimal convertedValue) == false)
                return 0;

            return convertedValue;
        }
    }
}