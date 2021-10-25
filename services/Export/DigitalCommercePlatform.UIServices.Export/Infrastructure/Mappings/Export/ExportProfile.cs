//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Common;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.Internal;
using Internal = DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using AutoMapper;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Export.Models.Order;
using Techdata.Common.Utility.CarrierTracking;
using Techdata.Common.Utility.CarrierTracking.Model;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Configurations
{
    [ExcludeFromCodeCoverage]
    public class ExportProfile : ProfileBase
    {
        public ExportProfile()
        {
            CreateMap<ItemModel, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product[0].Name))
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom(src => src.Product[0].Id))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.UnitListPrice, opt => opt.MapFrom(src => src.UnitListPrice))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.TotalPrice))
                .ForMember(dest => dest.UnitListPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.UnitListPrice)))
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.TotalPrice)))
                .ForMember(dest => dest.Agreements, opt => opt.MapFrom(src => src.Agreements))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Attributes))
                ;

            CreateMap<AddressModel, Address>()
                .ForPath(dest => dest.Line1, opt => opt.MapFrom(src => src.Address.Line1))
                .ForPath(dest => dest.City, opt => opt.MapFrom(src => src.Address.City))
                .ForPath(dest => dest.State, opt => opt.MapFrom(src => src.Address.State))
                .ForPath(dest => dest.Zip, opt => opt.MapFrom(src => src.Address.Zip))
                .ForPath(dest => dest.Country, opt => opt.MapFrom(src => src.Address.Country))
                .ForPath(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Contact.Phone))
                .ForPath(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Name));

            CreateMap<QuoteModel, QuoteDetails>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Address))
                .ForPath(dest => dest.ShipTo.CompanyName, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForPath(dest => dest.ShipTo.Email, opt => opt.MapFrom(src => src.ShipTo.Contact != null ? src.ShipTo.Contact.FirstOrDefault().Email : string.Empty))
                .ForPath(dest => dest.ShipTo.PhoneNumber, opt => opt.MapFrom(src => src.ShipTo.Contact != null ? src.ShipTo.Contact.FirstOrDefault().Phone : string.Empty))
                .ForPath(dest => dest.ShipTo.Name, opt => opt.MapFrom(src => src.ShipTo.Contact != null ? src.ShipTo.Contact.FirstOrDefault().Name : string.Empty))

                .ForMember(dest => dest.EndUser, opt => opt.MapFrom(src => src.EndUser.Address))
                .ForPath(dest => dest.EndUser.CompanyName, opt => opt.MapFrom(src => src.EndUser.Name))
                .ForPath(dest => dest.EndUser.Email, opt => opt.MapFrom(src => src.EndUser.Contact != null ? src.EndUser.Contact.FirstOrDefault().Email : string.Empty))
                .ForPath(dest => dest.EndUser.PhoneNumber, opt => opt.MapFrom(src => src.EndUser.Contact != null ? src.EndUser.Contact.FirstOrDefault().Phone : string.Empty))
                .ForPath(dest => dest.EndUser.Name, opt => opt.MapFrom(src => src.EndUser.Contact != null ? src.EndUser.Contact.FirstOrDefault().Name : string.Empty))

                .ForMember(dest => dest.Reseller, opt => opt.MapFrom(src => src.Reseller.Address))
                .ForPath(dest => dest.Reseller.CompanyName, opt => opt.MapFrom(src => src.Reseller.Name))
                .ForPath(dest => dest.Reseller.PhoneNumber, opt => opt.MapFrom(src => src.Reseller.Contact != null ? src.Reseller.Contact.FirstOrDefault().Phone : string.Empty))
                .ForPath(dest => dest.Reseller.Name, opt => opt.MapFrom(src => src.Reseller.Contact != null ? src.Reseller.Contact.FirstOrDefault().Name : string.Empty))
                .ForPath(dest => dest.Reseller.Email, opt => opt.MapFrom(src => src.Reseller.Contact != null ? src.Reseller.Contact.FirstOrDefault().Email : string.Empty))

                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
                .ForMember(dest => dest.QuoteReference, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.EndUserPO, opt => opt.MapFrom(src => src.EndUserPO))
                .ForMember(dest => dest.CustomerPO, opt => opt.MapFrom(src => src.CustomerPO))
                .ForMember(dest => dest.Orders, opt => opt.MapFrom(src => src.Orders))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
                .ForMember(dest => dest.Source, opt => opt.MapFrom(src => src.VendorReference != null ? src.VendorReference.FirstOrDefault().Type + ": " + src.VendorReference.FirstOrDefault().Value : string.Empty))
                .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.SubTotalFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.Price)))
                .ForMember(dest => dest.Tier, opt => opt.MapFrom(src => src.Type.Value))
                .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
                .ForMember(dest => dest.Expires, opt => opt.MapFrom(src => src.Expiry));

            CreateMap<Item, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom<TDPartNameResolver>())
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom<TDPartNameResolver>())
                .ForMember(dest => dest.MFRNumber, opt => opt.MapFrom<VendorPartResolver>())
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom<ManufacturerResolver>())
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom<LineTotalResolver>())
                .ForMember(dest => dest.Trackings, opt => opt.MapFrom<ShipmentsResolver>())
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.TotalPrice)))
                .ForPath(dest => dest.ExtendedPrice, opt => opt.MapFrom(src => src.TotalPurchaseCost))
                .ForPath(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForPath(dest => dest.Serials, opt => opt.MapFrom(src => src.Serials))
                .ForPath(dest => dest.License, opt => opt.MapFrom(src => src.License))
                .ForPath(dest => dest.StartDate, opt => opt.MapFrom(src => src.ContractStartDate))
                .ForPath(dest => dest.EndDate, opt => opt.MapFrom(src => src.ContractEndDate))
                .ForPath(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

            CreateMap<Internal.OrderModel, OrderDetailModel>()
                 .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo))
                 .ForMember(dest => dest.Lines, opt => opt.MapFrom(src => src.Items))
                 .ForPath(dest => dest.ShipTo.Name, opt => opt.MapFrom(src => src.ShipTo.Name))
                 .ForPath(dest => dest.PaymentDetails.NetValue, opt => opt.MapFrom(src => src.Price))
                 .ForPath(dest => dest.PaymentDetails.Reference, opt => opt.MapFrom(src => src.CustomerPO))
                 .ForPath(dest => dest.PaymentDetails.Currency, opt => opt.MapFrom(src => src.Currency))
                 .ForPath(dest => dest.PaymentDetails.CurrencySymbol, opt => opt.MapFrom(src => src.CurrencySymbol))
                 .ForPath(dest => dest.PaymentDetails.PaymentTermText, opt => opt.MapFrom(src => src.PaymentTermText))
                 .ForPath(dest => dest.Reseller.CompanyName, opt => opt.MapFrom(src => src.ShipTo.Name))
                 .ForPath(dest => dest.BlindPackaging, opt => opt.MapFrom(src => src.BlindPackaging))
                 .ForPath(dest => dest.PaymentDetails.Tax, opt => opt.MapFrom(src => src.Tax))
                 .ForPath(dest => dest.PaymentDetails.Freight, opt => opt.MapFrom(src => src.Freight))
                 .ForPath(dest => dest.PaymentDetails.Total, opt => opt.MapFrom(src => src.Total))
                 .ForPath(dest => dest.PaymentDetails.Subtotal, opt => opt.MapFrom(src => src.TotalCharge))
                 .ForPath(dest => dest.PaymentDetails.OtherFees, opt => opt.MapFrom(src => src.OtherFees))
                 .ForPath(dest => dest.PONumber, opt => opt.MapFrom(src => src.CustomerPO))
                 .ForPath(dest => dest.PODate, opt => opt.MapFrom(src => src.PoDate))
                 .ForPath(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                 .ForPath(dest => dest.OrderNumber, opt => opt.MapFrom(src => src.Source.Id))
                 .ForMember(dest => dest.EndUser, opt => opt.MapFrom<EndUserResolver>());
        }
    }
    [ExcludeFromCodeCoverage]
    public class DateResolver : IValueResolver<Internal.OrderModel, OrderDetailModel, string>
    {
        public string Resolve(Internal.OrderModel source, OrderDetailModel destination, string destMember, ResolutionContext context)
        {
            var poDate = source.PoDate.GetHashCode() == 0 ? string.Empty : source.PoDate.ToString("MM/dd/yy");
            return poDate;
        }
    }

    [ExcludeFromCodeCoverage]
    public class TDPartResolver : IValueResolver<Item, Line, string>
    {
        public string Resolve(Item source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA")).Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA")).FirstOrDefault()?.Id : "Unavailable";
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ShipmentsResolver : IValueResolver<Item, Line, List<TrackingDetails>>
    {
        public List<TrackingDetails> Resolve(Item source, Line destination, List<TrackingDetails> destMember, ResolutionContext context)
        {
            if (source.Shipments?.Count == 0)
                return new List<TrackingDetails>();

            return source.Shipments
                         .Select(shipment => new TrackingDetails()
                         {
                             Carrier = shipment.Carrier,
                             Description = shipment.Description,
                             TrackingNumber = shipment.TrackingNumber,
                             Date = shipment.Date
                         })
                         .ToList();
        }
    }

    [ExcludeFromCodeCoverage]
    public class LineTotalResolver : IValueResolver<Item, Line, decimal?>
    {
        public decimal? Resolve(Item source, Line destination, decimal? destMember, ResolutionContext context)
        {
            if (source.TotalPrice is null or (decimal?)0.0)
                source.TotalPrice = source.UnitPrice * source.Quantity;

            return source.TotalPrice;
        }
    }

    [ExcludeFromCodeCoverage]
    public class VendorPartResolver : IValueResolver<Item, Line, string>
    {
        public string Resolve(Item source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER")).Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER")).FirstOrDefault()?.Id : "Unavailable";
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class TDPartNameResolver : IValueResolver<Item, Line, string>
    {
        public string Resolve(Item source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA")).Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA")).FirstOrDefault()?.Name : "Unavailable";
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ManufacturerResolver : IValueResolver<Item, Line, string>
    {
        public string Resolve(Item source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA")).Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA")).FirstOrDefault()?.Manufacturer : "Unavailable";
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class LineTrackingsResolver : IValueResolver<Item, Line, List<TrackingDetails>>
    {
        public List<TrackingDetails> Resolve(Item source, Line destination, List<TrackingDetails> destMember, ResolutionContext context)
        {
            var _objShipment = new ShipmentUtility();
            var _objTrackingQuery = new TrackingQuery();

            var trackingDetails = source?.Shipments.Select(i => new TrackingDetails
            {
                ID = i.ID,
                Carrier = i.Carrier,
                Date = i.Date,
                Description = i.Description,
                DNote = i.DNote,
                DNoteLineNumber = i.DNoteLineNumber,
                GoodsReceiptNo = i.GoodsReceiptNo,
                ServiceLevel = i.ServiceLevel,
                TrackingNumber = i.TrackingNumber,
                TrackingLink = _objShipment.GetSingleCarrierInformation(new TrackingQuery { TrackingId = i.TrackingNumber })?.CarrierURL,
                Type = i.Type
            }).ToList();

            return trackingDetails;
        }
    }

    [ExcludeFromCodeCoverage]
    public class EndUserResolver : IValueResolver<Internal.OrderModel, OrderDetailModel, List<Address>>
    {
        public List<Address> Resolve(Internal.OrderModel source, OrderDetailModel destination, List<Address> destMember, ResolutionContext context)
        {
            var orderLines = source.Items.Where(x => x.EndUser != null).ToList();
            var lstEndUsers = new List<Address>();

            foreach (Item orderLine in orderLines)
            {
                if (!lstEndUsers.Where(a => a.CompanyName != null && a.CompanyName.ToUpper().Contains(orderLine.EndUser.Name?.ToUpper())).Any())
                {
                    var address = new Address
                    {
                        City = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.City) ? string.Empty : orderLine.EndUser.Address.City,
                        State = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.State) ? string.Empty : orderLine.EndUser.Address.State,
                        Line1 = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Line1) ? string.Empty : orderLine.EndUser.Address.Line1,
                        Line2 = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Line2) ? string.Empty : orderLine.EndUser.Address.Line2,
                        Line3 = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Line3) ? string.Empty : orderLine.EndUser.Address.Line3,
                        Country = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Country) ? string.Empty : orderLine.EndUser.Address.Country,
                        Zip = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Zip) ? string.Empty : orderLine.EndUser.Address.Zip,
                        PostalCode = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Zip) ? string.Empty : orderLine.EndUser.Address.Zip,
                        CompanyName = string.IsNullOrWhiteSpace(orderLine.EndUser.Name) ? string.Empty : orderLine.EndUser.Name,
                        PhoneNumber = string.IsNullOrWhiteSpace(orderLine.EndUser.Contact?.Phone) ? string.Empty : orderLine.EndUser.Contact?.Phone,
                        Name = string.IsNullOrWhiteSpace(orderLine.EndUser.Contact?.Name) ? string.Empty : orderLine.EndUser.Contact?.Name,
                        ContactEmail = string.IsNullOrWhiteSpace(orderLine.EndUser.Contact?.Email) ? string.Empty : orderLine.EndUser.Contact?.Email,
                    };

                    if (!string.IsNullOrWhiteSpace(address.CompanyName) || !string.IsNullOrWhiteSpace(address.Name))
                        lstEndUsers.Add(address);
                }
            }
            return lstEndUsers;
        }
    }
}
