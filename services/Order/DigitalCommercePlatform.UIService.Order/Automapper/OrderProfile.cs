using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Model.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIService.Order.Services;

namespace DigitalCommercePlatform.UIService.Order.AutoMapper
{
    [ExcludeFromCodeCoverage]
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<DTO.SalesOrder.Internal.AddressDto, AddressModel>();
            CreateMap<AgreementDto, AgreementModel>();
            CreateMap<DeliveryDto, DeliveryModel>();
            CreateMap<EndUserReferenceDto, EndUserReferenceModel>();
            CreateMap<IdValueDto, IdValueModel>();
            CreateMap<InvoiceDto, InvoiceModel>();
            CreateMap<ItemDto, ItemModel>();
            CreateMap<OrderLinkDto, OrderLinkModel>();
            CreateMap<AddressPartyDto, AddressPartyModel>();
            CreateMap<BasePartyDto, BasePartyModel>();
            CreateMap<ContactDto, ContactModel>();
            CreateMap<ContactPartyDto, ContactPartyModel>();
            CreateMap<PayerDto, PayerModel>();
            CreateMap<ProductDto, ProductModel>();
            CreateMap<QuoteLinkDto, QuoteLinkModel>();
            CreateMap<ShipmentDto, ShipmentModel>();

            CreateMap<SalesOrderDto, SalesOrderModel>();
            CreateMap<SummaryDto, SummaryModel>();

            CreateMap<FindRequestModel, FindRequestDto>();


            CreateMap<OrderDto, OrderResponse>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.DocType))
                .ForMember(dest => dest.Price, opt => opt.MapFrom<CustomPriceResolver>());

            CreateMap<ItemModelDto, OrderLineResponse>();
        }
    }

    public class CustomPriceResolver : IValueResolver<OrderDto, OrderResponse, string>
    {
        public string Resolve(OrderDto source, OrderResponse destination, string destMember, ResolutionContext context)
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