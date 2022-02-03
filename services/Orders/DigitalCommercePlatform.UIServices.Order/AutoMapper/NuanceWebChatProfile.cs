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
using Microsoft.AspNetCore.Mvc.Rendering;
using Techdata.Common.Utility.CarrierTracking;
using Techdata.Common.Utility.CarrierTracking.Model;
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
                .ForMember(x=>x.TrackingLink, y=> y.MapFrom((src, dest, context) => GetTrackingLink(src)))
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
                .ForMember(x => x.StatusCount, y => y.MapFrom((src, dest, context) => GetStatusCount(src.Items)))
                .ForMember(x => x.OrderDetailsLink, y => y.MapFrom((src, dest, context) => GetLink(src.Source.Id)))
                .ForMember(x => x.Reseller, y => y.MapFrom((src, dest, context) => GetReseller(src.Reseller)))
                .ForMember(x => x.IsDropShip, y => y.Ignore())
              ;
            CreateMap<Models.Order.Internal.ItemModel,
                    DigitalCommercePlatform.UIServices.Order.Models.Internal.ItemModel>()
                .ForMember(x => x.Status, y => y.MapFrom((src, dest, context) => GetItemStatus(src)))
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

        private List<StatusCountModel> GetStatusCount(List<Models.Order.Internal.ItemModel> model)
        {
            var statusList = model.GroupBy(n => n.Status)
                .Select(x => new StatusCountModel() { Status = GetStatus(x.Key), Count = x.Count() }).ToList();
            return statusList;
        }


        private string GetTrackingLink(ShipmentModel src)
        {
            var shipmentUtility = new ShipmentUtility();
            return shipmentUtility.GetSingleCarrierInformation(new TrackingQuery()
            {
                TrackingId = src.TrackingNumber
            })?.CarrierImageURL;
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
            return OrderStatusMap.ContainsKey(status) ? OrderStatusMap[status] : "WRONG STATUS";
        }

        private object GetItemStatus(Models.Order.Internal.ItemModel item)
        {
            if (item.BackOrderIndicator == "Y") return "Back Ordered";
            return ItemStatusMap.ContainsKey(item.Status) ? ItemStatusMap[item.Status] : "WRONG STATUS";
        }

        private readonly Dictionary<Status, string> OrderStatusMap = new Dictionary<Status, string>()
        {
            { Status.OPEN, "OPEN" },
            { Status.ON_HOLD, "IN REVIEW" },
            { Status.IN_PROCESS, "OPEN & IN PROCESS" },
            { Status.SHIPPED, "SHIPPED" },
            { Status.CANCELLED, "CANCELED" },
        };

        private readonly Dictionary<Status, string> ItemStatusMap = new Dictionary<Status, string>()
        {
            { Status.OPEN, "In Process" },
            { Status.ON_HOLD, "In Process" },
            { Status.IN_PROCESS, "In Process" },
            { Status.SHIPPED, "Shipped" },
            { Status.CANCELLED, "Canceled" },
        };
    }
}
