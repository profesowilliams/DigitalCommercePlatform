//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Common;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.Internal;
using Internal = DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export
{
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
                .ForMember(dest => dest.UnitListPriceFormatted, opt => opt.MapFrom(src => string.Format(PRICE_FORMAT, src.UnitListPrice)))
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format(PRICE_FORMAT, src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format(PRICE_FORMAT, src.TotalPrice)))
                .ForMember(dest => dest.Agreements, opt => opt.MapFrom(src => src.Agreements))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Attributes))
                .ForMember(dest => dest.ContractNo, opt => opt.MapFrom(src => src.ContractNumber))

                .ForMember(d => d.VendorPartNo, o => o.Ignore())
                .ForMember(d => d.Manufacturer, o => o.Ignore())
                .ForMember(d => d.MSRP, o => o.Ignore())
                .ForMember(d => d.Invoice, o => o.Ignore())
                .ForMember(d => d.ShortDescription, o => o.Ignore())
                .ForMember(d => d.MFRNumber, o => o.Ignore())
                .ForMember(d => d.UPCNumber, o => o.Ignore())
                .ForMember(d => d.ExtendedPrice, o => o.Ignore())
                .ForMember(d => d.Availability, o => o.Ignore())
                .ForMember(d => d.RebateValue, o => o.Ignore())
                .ForMember(d => d.URLProductImage, o => o.Ignore())
                .ForMember(d => d.URLProductSpecs, o => o.Ignore())
                .ForMember(d => d.Children, o => o.Ignore())
                .ForMember(d => d.Serials, o => o.Ignore())
                .ForMember(d => d.Trackings, o => o.Ignore())
                .ForMember(d => d.StartDate, o => o.Ignore())
                .ForMember(d => d.EndDate, o => o.Ignore())
                .ForMember(d => d.IsSubLine, o => o.Ignore())
                .ForMember(d => d.Annuity, o => o.Ignore())
                .ForMember(d => d.BillingModel, o => o.Ignore())
                .ForMember(d => d.ClassificationType, o => o.Ignore())
                ;

            CreateMap<AddressModel, Address>()
                .ForPath(dest => dest.Line1, opt => opt.MapFrom(src => src.Address.Line1))
                .ForPath(dest => dest.Line2, opt => opt.MapFrom(src => src.Address.Line2))
                .ForPath(dest => dest.Line3, opt => opt.MapFrom(src => src.Address.Line3))
                .ForPath(dest => dest.City, opt => opt.MapFrom(src => src.Address.City))
                .ForPath(dest => dest.State, opt => opt.MapFrom(src => src.Address.State))
                .ForPath(dest => dest.Zip, opt => opt.MapFrom(src => src.Address.Zip))
                .ForPath(dest => dest.PostalCode, opt => opt.MapFrom(src => src.Address.Zip))
                .ForPath(dest => dest.Country, opt => opt.MapFrom(src => src.Address.Country))
                .ForPath(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Contact.Phone))
                .ForPath(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Name))
                .ForPath(dest => dest.Email, opt => opt.MapFrom(src => src.Contact.Email))
                .ForPath(dest => dest.Id, opt => opt.Ignore())
                ;


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
                .ForMember(dest => dest.VendorReference, opt => opt.MapFrom(src => src.VendorReference))
                .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.SubTotalFormatted, opt => opt.MapFrom(src => string.Format(PRICE_FORMAT, src.Price)))
                .ForMember(dest => dest.Tier, opt => opt.MapFrom(src => src.Type.Value))
                .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
                .ForMember(dest => dest.Expires, opt => opt.MapFrom(src => src.Expiry))

                .ForMember(d => d.Notes, o => o.Ignore())
                .ForMember(d => d.SPAId, o => o.Ignore())
                .ForMember(d => d.Request, o => o.Ignore())
                ;

            CreateMap<Item, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom<TDPartNameResolver>())
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom<TDPartNameResolver>())
                .ForMember(dest => dest.MFRNumber, opt => opt.MapFrom<VendorPartResolver>())
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom<ManufacturerResolver>())
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom<LineTotalResolver>())
                .ForMember(dest => dest.Trackings, opt => opt.MapFrom<ShipmentsResolver>())
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format(PRICE_FORMAT, src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format(PRICE_FORMAT, src.TotalPrice)))
                .ForPath(dest => dest.ExtendedPrice, opt => opt.MapFrom(src => src.TotalPurchaseCost))
                .ForPath(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForPath(dest => dest.Serials, opt => opt.MapFrom(src => src.Serials))
                .ForPath(dest => dest.License, opt => opt.MapFrom(src => src.License))
                .ForPath(dest => dest.StartDate, opt => opt.MapFrom(src => src.ContractStartDate))
                .ForPath(dest => dest.EndDate, opt => opt.MapFrom(src => src.ContractEndDate))
                .ForPath(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForPath(dest => dest.ContractNo, opt => opt.MapFrom(src => src.ContractNo))

                .ForMember(d => d.VendorPartNo, o => o.Ignore())
                .ForMember(d => d.MSRP, o => o.Ignore())
                .ForMember(d => d.Invoice, o => o.Ignore())
                //.ForMember(d => d.Contract, o => o.Ignore())
                .ForMember(d => d.ShortDescription, o => o.Ignore())
                .ForMember(d => d.UPCNumber, o => o.Ignore())
                .ForMember(d => d.UnitListPrice, o => o.Ignore())
                .ForMember(d => d.UnitListPriceFormatted, o => o.Ignore())
                .ForMember(d => d.Availability, o => o.Ignore())
                .ForMember(d => d.RebateValue, o => o.Ignore())
                .ForMember(d => d.URLProductImage, o => o.Ignore())
                .ForMember(d => d.URLProductSpecs, o => o.Ignore())
                .ForMember(d => d.Children, o => o.Ignore())
                .ForMember(d => d.Attributes, o => o.Ignore())
                .ForMember(d => d.Agreements, o => o.Ignore())
                .ForMember(d => d.IsSubLine, o => o.Ignore())
                .ForMember(d => d.Annuity, o => o.Ignore())
                .ForMember(d => d.BillingModel, o => o.Ignore())
                .ForMember(d => d.ClassificationType, o => o.Ignore())
                ;

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
                 .ForPath(dest => dest.PaymentDetails.Subtotal, opt => opt.MapFrom(src => src.Price))
                 .ForPath(dest => dest.PaymentDetails.OtherFees, opt => opt.MapFrom(src => src.OtherFees))
                 .ForPath(dest => dest.PONumber, opt => opt.MapFrom(src => src.CustomerPO))
                 .ForPath(dest => dest.PODate, opt => opt.MapFrom(src => src.PoDate))
                 .ForPath(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                 .ForPath(dest => dest.OrderNumber, opt => opt.MapFrom(src => src.Source.ID))
                 .ForMember(dest => dest.EndUser, opt => opt.MapFrom<EndUserResolver>())

                 .ForMember(d => d.CanBeExpedited, o => o.Ignore())
                 .ForMember(d => d.EndUserNotifications, o => o.Ignore())
                 .ForMember(d => d.ResellerNotifications, o => o.Ignore())
                 .ForMember(d => d.Message, o => o.Ignore())
                 .ForMember(d => d.QuoteNumber, o => o.Ignore())
                 .ForMember(d => d.SiteID, o => o.Ignore())
                 .ForMember(d => d.ShipComplete, o => o.Ignore())
                 .ForMember(d => d.StandardOrderStatusCode, o => o.Ignore())
                 .ForMember(d => d.StandardOrderStatus, o => o.Ignore())
                 .ForMember(d => d.ConfigurationOrderStatus, o => o.Ignore())
                 .ForMember(d => d.SiteURL, o => o.Ignore())

                 .ForMember(d => d.ExportedFields, o => o.Ignore())
                 ;
        }
    }
}
