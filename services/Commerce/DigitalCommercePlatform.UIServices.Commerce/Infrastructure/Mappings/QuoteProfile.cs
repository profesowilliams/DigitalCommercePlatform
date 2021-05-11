using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<ItemModel, Line>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product[0].Name))
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom(src => src.Product[0].Id))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.UnitListPrice, opt => opt.MapFrom(src => src.UnitListPrice))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.TotalPrice))
                .ForMember(dest => dest.UnitListPriceFormatted, opt => opt.MapFrom(src => string.Format(src.UnitListPrice % 1 == 0 ? "{0:N2}" : "{0:N2}", src.UnitListPrice)))
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format(src.UnitPrice % 1 == 0 ? "{0:N2}" : "{0:N2}", src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format(src.TotalPrice % 1 == 0 ? "{0:N2}" : "{0:N2}", src.TotalPrice)));

            CreateMap<AddressModel, Address>();


            CreateMap<QuoteModel, QuoteDetails>()
            .ForMember(dest => dest.ShipTo, opt => opt.MapFrom(src => src.ShipTo.Address))
            .ForPath(dest => dest.ShipTo.CompanyName, opt => opt.MapFrom(src => src.ShipTo.Name))
            .ForPath(dest => dest.ShipTo.Email, opt => opt.MapFrom(src => src.ShipTo.Contact != null ? src.ShipTo.Contact.FirstOrDefault().Email : string.Empty))
            .ForPath(dest => dest.ShipTo.PhoneNumber, opt => opt.MapFrom(src => src.ShipTo.Contact != null ? src.ShipTo.Contact.FirstOrDefault().Phone : string.Empty))
            .ForPath(dest => dest.ShipTo.Name, opt => opt.MapFrom(src => src.ShipTo.Contact != null ? src.ShipTo.Contact.FirstOrDefault().Name : string.Empty))

            .ForMember(dest => dest.EndUser, opt => opt.MapFrom(src => src.EndUser.Address))
            .ForPath(dest => dest.EndUser.CompanyName, opt => opt.MapFrom(src => src.EndUser.Name))
            .ForPath(dest => dest.EndUser.Email, opt => opt.MapFrom(src => src.EndUser.Contact!=null?src.EndUser.Contact.FirstOrDefault().Email:string.Empty))
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
            .ForMember(dest => dest.Source, opt => opt.MapFrom(src =>src.VendorReference!=null? src.VendorReference.FirstOrDefault().Type + ": " + src.VendorReference.FirstOrDefault().Value:string.Empty))
            .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.SubTotalFormatted, opt => opt.MapFrom(src => string.Format(src.Price % 1 == 0 ? "{0:N2}" : "{0:N2}", src.Price)))
            .ForMember(dest => dest.Tier, opt => opt.MapFrom(src => src.Type.Value));

            CreateMap<QuoteModel, GetQuote.Response>()
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src));

            CreateMap<FindResponse<IEnumerable<QuoteModel>>, FindQuotes.Response>();

            CreateMap<QuoteModel, QuotesForGridModel>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
             .ForMember(dest => dest.QuoteReference, opt => opt.MapFrom(src => src.Description))
             .ForMember(dest => dest.Vendor, opt => opt.MapFrom(src =>src.VendorReference.FirstOrDefault().Type))//Need to have reference
             .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
             .ForMember(dest => dest.Expires, opt => opt.MapFrom(src => src.Expiry))
             .ForMember(dest => dest.EndUserName, opt => opt.MapFrom(src => src.EndUser.Name))
             .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src.Agreements))
             .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
             .ForMember(dest => dest.QuoteValue, opt => opt.MapFrom(src => src.Price))
             .ForMember(dest => dest.FormatedQuoteValue, opt => opt.MapFrom(src => string.Format(src.Price % 1 == 0 ? "{0:N2}" : "{0:N2}", src.Price))) 
             .ForMember(dest => dest.CanUpdate, opt => opt.MapFrom(src => string.Join( "","true")))
             .ForMember(dest => dest.CanCheckOut, opt => opt.MapFrom(src => string.Join( "","True")));

            CreateMap<FindResponse<IEnumerable<QuoteModel>>, GetQuotesForGrid.Response>()
                 .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Data));
        }
    }
}
