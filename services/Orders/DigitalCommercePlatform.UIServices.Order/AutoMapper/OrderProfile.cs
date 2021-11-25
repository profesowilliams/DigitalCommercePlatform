//2021 (c) Tech Data Corporation -. All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto.Order;
using DigitalCommercePlatform.UIServices.Order.Dto.Order.Internal;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Models.Order.Internal;

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
            CreateMap<PayerDto, PayerModel>();
            CreateMap<ProductDto, ProductModel>();
            CreateMap<QuoteLinkDto, QuoteLinkModel>();
            CreateMap<ShipmentDto, ShipmentModel>();
            CreateMap<ServiceContractDetailDto, ServiceContractDetailModel>();
            CreateMap<OrderDto, OrderModel>();
            CreateMap<SourceDto, SourceModel>();
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
