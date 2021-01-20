using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Model.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;

namespace DigitalCommercePlatform.UIService.Order.AutoMapper
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
            CreateMap<PayerDto, PayerModel>();
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