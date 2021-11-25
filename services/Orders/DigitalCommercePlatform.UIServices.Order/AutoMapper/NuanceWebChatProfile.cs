//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.Dto;
using DigitalCommercePlatform.UIServices.Order.Dto.Internal;
using DigitalCommercePlatform.UIServices.Order.Dto.Order;
using DigitalCommercePlatform.UIServices.Order.Enum;
using DigitalCommercePlatform.UIServices.Order.Models;
using DigitalCommercePlatform.UIServices.Order.Models.Internal;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Models.Order.Internal;
using AddressDto = DigitalCommercePlatform.UIServices.Order.Dto.Internal.AddressDto;
using AddressModel = DigitalCommercePlatform.UIServices.Order.Models.Internal.AddressModel;
using ItemDto = DigitalCommercePlatform.UIServices.Order.Dto.Internal.ItemDto;
using ItemModel = DigitalCommercePlatform.UIServices.Order.Models.Internal.ItemModel;

namespace DigitalCommercePlatform.UIServices.Order.AutoMapper
{
    public class NuanceWebChatProfile:Profile
    {
        public NuanceWebChatProfile()
        {
            var culture = CultureInfo.InvariantCulture.Clone() as CultureInfo;
            culture.NumberFormat.NumberDecimalSeparator = ".";
            CreateMap<AddressDto, AddressModel>();
            CreateMap<ItemDto, ItemModel>();
            CreateMap<ResellerDto, ResellerModel>();
            CreateMap<ShipmentsDto, ShipmentsModel>();
            CreateMap<DigitalCommercePlatform.UIServices.Order.Models.Order.Internal.ShipmentModel,DigitalCommercePlatform.UIServices.Order.Models.Internal.ShipmentsModel > ()
                .ForMember(x=> x.Carrier, y=> y.MapFrom(s=> s.Carrier))
                .ForMember(x => x.TrackingNumber, y => y.MapFrom(s => s.TrackingNumber))
                .ForMember(x => x.Description, y => y.MapFrom(s => s.Description))
                .ForMember(x => x.Date, y => y.MapFrom(s => s.Date))
                .ForMember(x=>x.TrackingLink, y=> y.Ignore())
                ;
            CreateMap<StatusCountDto, StatusCountModel>();
            CreateMap<NuanceChatBotResponseDto, NuanceChatBotResponseModel>();
            CreateMap<NuanceWebChatRequest, FindRequestModel>()
                .ForMember(x => x.CustomerPO, s => s.MapFrom(y => y.OrderQuery.CustomerPo))
                .ForMember(x => x.ManufacturerPartNumber, s => s.MapFrom(y => y.OrderQuery.ManufacturerPartNumber))
                .ForMember(x => x.ID, s => s.MapFrom(y => y.OrderQuery.OrderId))
                .ForMember(x => x.Page, y => y.Ignore())
                .ForMember(x => x.PageSize, y => y.Ignore())
                .ForMember(x => x.Details, y => y.Ignore());
            CreateMap<OrderModel, NuanceChatBotResponseModel>()
                .ForMember(x => x.Status, y => y.MapFrom((src, dest, context) => GetStatus(src.Status)))
                .ForMember(x => x.OrderId, y => y.MapFrom(s => s.Source.Id))
                .ForMember(x => x.StatusCount, y => y.Ignore())
                .ForMember(x => x.OrderDetailsLink, y => y.MapFrom((src, dest, context) => GetLink(src.Source.Id)))
                .ForMember(x => x.Reseller, y => y.MapFrom((src, dest, context) => GetReseller(src.Reseller)))
                .ForMember(x => x.IsDropShip, y => y.Ignore())
              ;
            CreateMap<Models.Order.Internal.ItemModel,
                    DigitalCommercePlatform.UIServices.Order.Models.Internal.ItemModel>()
                .ForMember(x => x.Status, y => y.MapFrom((src, dest, context) => GetStatus(src.Status)))
                .ForMember(x=> x.TechDataPartNumber, y=>y.MapFrom(s=>s.Product.FirstOrDefault(f=> f.Type == ProductType.TECHDATA).ID))
                .ForMember(x => x.Name, y => y.MapFrom(s => s.Product.FirstOrDefault(f => f.Type == ProductType.TECHDATA).Name))
                .ForMember(x => x.LineId, y => y.MapFrom(s => s.ID))
                .ForMember(x => x.Manufacturer, y => y.MapFrom(s => s.Product.FirstOrDefault(f => f.Type == ProductType.TECHDATA).Manufacturer))
                .ForMember(x => x.ManufacturerPartNumber, y => y.MapFrom(s => s.Product.FirstOrDefault(f => f.Type == ProductType.MANUFACTURER).ID))
                ;
            CreateMap<ResellerModel, AddressModel>()
                .ForMember(x => x.State, y => y.MapFrom(s => s.Address.State))
                .ForMember(x => x.City, y => y.MapFrom(s => s.Address.City))
                .ForMember(x => x.Country, y => y.MapFrom(s => s.Address.Country))
                .ForMember(x => x.Zip, y => y.MapFrom(s => s.Address.Zip))
                .ForMember(x => x.Line1, y => y.MapFrom(s => s.Address.Line1))
                .ForMember(x => x.Line2, y => y.MapFrom(s => s.Address.Line2))
                .ForMember(x => x.Line3, y => y.MapFrom(s => s.Address.Line3))
                
                ;
            CreateMap<ResellerModel, AddressPartyModel>()
                .ForMember(x => x.ID, y => y.MapFrom(s => s.Id))
                .ForMember(x => x.Name, y => y.MapFrom(s => s.Name))
                .ForMember(x => x.Contact, y => y.Ignore())
                .ForPath(x => x.Address.Country, y => y.MapFrom(s => s.Address.Country))
                .ForPath(x => x.Address.ZIP, y => y.MapFrom(s => s.Address.Zip))
                .ForPath(x => x.Address.Line1, y => y.MapFrom(s => s.Address.Line1))
                .ForPath(x => x.Address.Line2, y => y.MapFrom(s => s.Address.Line2))
                .ForPath(x => x.Address.Line3, y => y.MapFrom(s => s.Address.Line3))

                ;
        }

        private string GetLink(string sourceId)
        {
            return $"https://shop.techdata.com/orderV2/{sourceId}";
        }

        private ResellerModel GetReseller(AddressPartyModel reseller)
        {
            return new ResellerModel()
            {
                Address = new AddressModel()
                {
                    City = reseller.Address.City,
                    Country = reseller.Address.Country,
                    Line1 = reseller.Address.Line1,
                    Line2 = reseller.Address.Line2,
                    Line3 = reseller.Address.Line3,
                    State = reseller.Address.State,
                    Zip = reseller.Address.ZIP
                },
                Id = reseller.ID,
                Name = reseller.Name

            };
        }

        private string GetStatus(Status status)
        {
            switch (status)
            {
                case Status.OPEN:
                    return "OPEN";
                case Status.IN_PROCESS:
                    return "OPEN AND IN PROCESS";
                case Status.ON_HOLD:
                    return "IN REVIEW";
                case Status.SHIPPED:
                    return "SHIPPED";
                case Status.CANCELLED:
                    return "CANCELLED";
                default:
                    throw new ArgumentOutOfRangeException(nameof(status));
            }
        }
    }
}
