//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using Techdata.Common.Utility.CarrierTracking;
using Techdata.Common.Utility.CarrierTracking.Model;
using Techdata.Common.Utility.Globalization;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<DateTime, string>().ConvertUsing(dt => dt.ToString("MM/dd/yy"));

            CreateMap<OrderModel, RecentOrdersModel>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Name))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
                .ForMember(dest => dest.Reseller, opt => opt.MapFrom(src => src.CustomerPO))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.OrderMethod))
                .ForMember(dest => dest.IsReturn, opt => opt.MapFrom(src => src.Return))
                .ForMember(dest => dest.Vendor, opt => opt.MapFrom<OrderVendorResolver>())
                .ForMember(dest => dest.Price, opt => opt.MapFrom<OrderPriceResolver>())
                .ForMember(dest => dest.Invoices, opt => opt.MapFrom<OrderInvoicesResolver>())
                .ForMember(dest => dest.Trackings, opt => opt.MapFrom<OrderTrackingsResolver>())
                .ForMember(dest => dest.Status, opt => opt.MapFrom<OrderStatusResolver>());

            CreateMap<Item, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom<TDPartNameResolver>())
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom<TDPartNameResolver>())
                .ForMember(dest => dest.MFRNumber, opt => opt.MapFrom<VendorPartResolver>())
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom<ManufacturerResolver>())
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.Serials, opt => opt.MapFrom(src => src.Serials))
                .ForMember(dest => dest.Trackings, opt => opt.MapFrom<LineTrackingsResolver>())
                .ForMember(dest => dest.ShipDates, opt => opt.MapFrom<LineShippingDatesResolver>())
                .ForMember(dest => dest.Status, opt => opt.MapFrom<LineLevelStatusResolver>())
                .ForMember(dest => dest.PAKs, opt => opt.Ignore())
                .ForMember(dest => dest.Authorization, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom<LineTotalResolver>())
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.TotalPrice)));


            CreateMap<AddressDetails, Address>();

            CreateMap<Item, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom<TDPartNameResolver>())
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom<TDPartResolver>())
                .ForMember(dest => dest.MFRNumber, opt => opt.MapFrom<VendorPartResolver>())
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom<ManufacturerResolver>())
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.Serials, opt => opt.MapFrom(src => src.Serials))
                .ForMember(dest => dest.Trackings, opt => opt.MapFrom<LineTrackingsResolver>())
                .ForMember(dest => dest.ShipDates, opt => opt.MapFrom<LineShippingDatesResolver>())
                .ForMember(dest => dest.Invoices, opt => opt.MapFrom(src => src.Invoices))
                .ForMember(dest => dest.Status, opt => opt.MapFrom<LineLevelStatusResolver>())
                .ForMember(dest => dest.PAKs, opt => opt.Ignore())
                .ForMember(dest => dest.Authorization, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom<LineTotalResolver>())
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.TotalPrice)));


            CreateMap<OrderModel, OrderDetailModel>()
                .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Address))
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
                .ForPath(dest => dest.PaymentDetails.Subtotal, opt => opt.MapFrom(src => src.Price))
                .ForPath(dest => dest.PaymentDetails.OtherFees, opt => opt.MapFrom(src => src.OtherFees))
                .ForPath(dest => dest.PONumber, opt => opt.MapFrom(src => src.CustomerPO))
                .ForPath(dest => dest.Created, opt => opt.MapFrom(s => s.Created))
                .ForMember(dest => dest.PODate, opt => opt.MapFrom<DateResolver>())
                .ForMember(dest => dest.Status, opt => opt.MapFrom<OrderDetailStatusResolver>())
                .ForMember(dest => dest.OrderNumber, opt => opt.MapFrom(src => src.Source.ID))
                .ForMember(dest => dest.EndUser, opt => opt.MapFrom<EndUserResolver>());

        }
    }

    [ExcludeFromCodeCoverage]
    public class OrderDetailStatusResolver : IValueResolver<OrderModel, OrderDetailModel, string>
    {
        public string Resolve(OrderModel source, OrderDetailModel destination, string destMember, ResolutionContext context)
        {
            if (source.Status == Status.ON_HOLD)
            {
                source.Status = Status.SALES_REVIEW;
            }
            if (source.Status == Status.IN_PIPELINE)
            {
                source.Status = Status.IN_PROCESS;
            }
            return source.Status.ToString().ToTitleCase();
        }
    }
    
    [ExcludeFromCodeCoverage]
    public class OrderStatusResolver : IValueResolver<OrderModel, RecentOrdersModel, string>
    {
        public string Resolve(OrderModel source, RecentOrdersModel destination, string destMember, ResolutionContext context)
        {
            if (source.Status == Status.ON_HOLD)
            {
                source.Status = Status.SALES_REVIEW;
            }
            if (source.Status == Status.IN_PIPELINE)
            {
                source.Status = Status.IN_PROCESS;
            }
            return source.Status.ToString().ToTitleCase();
        }
    }

    [ExcludeFromCodeCoverage]
    public class LineLevelStatusResolver : IValueResolver<Item, Line, string>
    {
        public string Resolve(Item source, Line destination, string destMember, ResolutionContext context)
        {
            source.Status = !string.IsNullOrWhiteSpace(source.Status) ? source.Status : string.Empty;

            if (source?.Status == "ON_HOLD")
            {
                source.Status = StringConstants.OrderStatus.SALES_REVIEW;
            }
            if (source?.Status == "IN_PIPELINE")
            {
                source.Status = StringConstants.OrderStatus.IN_PROCESS;
            }

            return !string.IsNullOrWhiteSpace(source.Status) ? source.Status.ToString().ToTitleCase() : string.Empty;
        }
    }

    [ExcludeFromCodeCoverage]
    public class DateResolver : IValueResolver<OrderModel, OrderDetailModel, string>
    {
        public string Resolve(OrderModel source, OrderDetailModel destination, string destMember, ResolutionContext context)
        {
            var poDate = source.PoDate.GetHashCode() == 0 ? string.Empty : source.PoDate?.ToString("MM/dd/yy");
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
    public class OrderPriceResolver : IValueResolver<OrderModel, RecentOrdersModel, string>
    {
        public string Resolve(OrderModel source, RecentOrdersModel destination, string destMember, ResolutionContext context)
        {
            return source.Price.HasValue ? CurrencyHelper.GetFormattedAmount(source.Price.Value) : string.Empty;
        }
    }

    [ExcludeFromCodeCoverage]
    public class OrderVendorResolver : IValueResolver<OrderModel, RecentOrdersModel, List<Vendor>>
    {
        public List<Vendor> Resolve(OrderModel source, RecentOrdersModel destination, List<Vendor> destMember, ResolutionContext context)
        {
            //var Vendor = source.Items.Where(x => x.Product.FirstOrDefault().Manufacturer != null);
            if (source.Items == null) return new List<Vendor>();

            var vendorDetails = source.Items.SelectMany(i => i.Product).Where(i => i.Manufacturer != null).GroupBy(i => i.Manufacturer)
              .Select(i => new Vendor
              {
                  VendorName = i.Key
              }).ToList();
            return vendorDetails;


        }
    }

    [ExcludeFromCodeCoverage]
    public class OrderInvoicesResolver : IValueResolver<OrderModel, RecentOrdersModel, List<InvoiceDetails>>
    {
        public List<InvoiceDetails> Resolve(OrderModel source, RecentOrdersModel destination, List<InvoiceDetails> destMember, ResolutionContext context)
        {
            if (source?.Items == null) { return new List<InvoiceDetails>(); }

            var invoiceDetails = source.Items.SelectMany(i => i?.Invoices).Where(i => i.Price.HasValue && i.Price > 0)
                .Select(i => new InvoiceDetails
                {
                    Created = i.Created,
                    ID = i.ID,
                    Line = i.Line,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList();

            var pendingInvoiceDetails = (from item in source.Items.Where(i => i.Invoices == null || i.Invoices.Count == 0)
                                         group item by 1 into g
                                         select new InvoiceDetails
                                         {
                                             ID = "Pending",
                                             Line = "",
                                             Quantity = g.Sum(x => x.Quantity),
                                             Price = g.Sum(x => x.TotalPrice),
                                             Created = null
                                         }).FirstOrDefault();

            if (pendingInvoiceDetails != null)
            {
                invoiceDetails.Add(pendingInvoiceDetails);
            }

            return invoiceDetails;
        }
    }

    [ExcludeFromCodeCoverage]
    public class LineTrackingsResolver : IValueResolver<Item, Line, List<TrackingDetails>>
    {
        public List<TrackingDetails> Resolve(Item source, Line destination, List<TrackingDetails> destMember, ResolutionContext context)
        {
            var _objShipment = new ShipmentUtility();
            //var _objTrackingQuery = new TrackingQuery();

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
    public class LineShippingDatesResolver : IValueResolver<Item, Line, List<DateTime?>>
    {
        public List<DateTime?> Resolve(Item source, Line destination, List<DateTime?> destMember, ResolutionContext context)
        {
            var shipmentDates = new List<DateTime?>();
            if (source.Shipments != null)
            {
                foreach (var shipment in source?.Shipments)
                {
                    if (shipment.Date != null)
                        shipmentDates.Add(shipment.Date);
                }
            }

            return shipmentDates;
        }
    }

    [ExcludeFromCodeCoverage]
    public class OrderTrackingsResolver : IValueResolver<OrderModel, RecentOrdersModel, List<TrackingDetails>>
    {
        public List<TrackingDetails> Resolve(OrderModel source, RecentOrdersModel destination, List<TrackingDetails> destMember, ResolutionContext context)
        {
            var _objShipment = new ShipmentUtility();
            //var _objTrackingQuery = new TrackingQuery();

            var trackingDetails = source?.Items?.SelectMany(i => i.Shipments).Select(i => new TrackingDetails
            {
                OrderNumber = source.Source.ID,
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
    public static class StringExtensions
    {
        public static string ToTitleCase(this string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return string.Empty;

            var result = value.ToString().ToLower();

            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;
            result = textInfo.ToTitleCase(result.Replace("_", " "));

            return result;
        }
    }

    [ExcludeFromCodeCoverage]
    public class EndUserResolver : IValueResolver<OrderModel, OrderDetailModel, List<Address>>
    {
        public List<Address> Resolve(OrderModel source, OrderDetailModel destination, List<Address> destMember, ResolutionContext context)
        {
            var orderLines = source.Items.Where(x => x.EndUser != null)?.ToList();
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
