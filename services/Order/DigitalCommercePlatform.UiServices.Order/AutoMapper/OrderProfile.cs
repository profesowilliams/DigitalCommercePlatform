using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder.Internal;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal;

namespace DigitalCommercePlatform.UIServices.Order.AutoMapper
{
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
            CreateMap<ItemDto, ItemModel>();
            CreateMap<OrderLinkDto, OrderLinkModel>();
            CreateMap<AddressPartyDto, AddressPartyModel>();
            CreateMap<BasePartyDto, BasePartyModel>();
            CreateMap<ContactDto, ContactModel>();
            CreateMap<ContactPartyDto, ContactPartyModel>();
            CreateMap<ProductDto, ProductModel>();
            CreateMap<QuoteLinkDto, QuoteLinkModel>();
            CreateMap<ShipmentDto, ShipmentModel>();

            CreateMap<SalesOrderDto, SalesOrderModel>();
            CreateMap<SummaryDto, SummaryModel>();

            CreateMap<FindRequestModel, FindRequestDto>();
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