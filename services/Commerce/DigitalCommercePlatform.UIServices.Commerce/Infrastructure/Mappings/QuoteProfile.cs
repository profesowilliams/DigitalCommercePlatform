//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class QuoteProfile : Profile
    {
        [SuppressMessage("Critical Code Smell", "S3776:Cognitive Complexity of methods should not be too high", Justification = "<Pending>")]
        public QuoteProfile()
        {
            CreateMap<DateTime, string>().ConvertUsing(dt => dt.ToString("MM/dd/yy"));
            CreateMap<Models.Quote.Quote.Internal.AgreementModel, Models.Quote.AgreementModel>();

            CreateMap<ItemModel, Line>()
                .ForMember(dest => dest.Annuity, opt => opt.MapFrom(src => src.Annuity))
                .ForMember(dest => dest.Description, opt => opt.MapFrom<ItemDescriptionResolver>())
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom<ItemManufacturerResolver>())
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom<ItemTDPartNumberResolver>())
                .ForMember(dest => dest.MFRNumber, opt => opt.MapFrom<ItemMfrPartNumberResolver>())
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.UnitListPrice, opt => opt.MapFrom(src => src.UnitListPrice))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.TotalPrice))
                .ForMember(dest => dest.UnitListPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.UnitListPrice)))
                .ForMember(dest => dest.UnitPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.UnitPrice)))
                .ForMember(dest => dest.TotalPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.TotalPrice)))
                .ForMember(dest => dest.Serials, opt => opt.Ignore())
                .ForMember(dest => dest.Invoices, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.PAKs, opt => opt.Ignore())
                .ForMember(dest => dest.Trackings, opt => opt.Ignore())
                .ForMember(dest => dest.ShipDates, opt => opt.Ignore())
                .ForMember(dest => dest.Authorization, opt => opt.Ignore())
                .ForMember(dest => dest.PurchaseCost, opt => opt.MapFrom(src => src.PurchaseCost))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom<LineAttributeResolver>())
                .ForMember(dest => dest.Agreements, opt => opt.MapFrom(src => src.Agreements));

            CreateMap<AddressModel, Address>();

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
            .ForMember(dest => dest.QuoteSource, opt => opt.MapFrom(src => src.Source))
            .ForMember(dest => dest.Attributes, opt => opt.MapFrom<AttributeResolver>())
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
            .ForMember(dest => dest.Source, opt => opt.MapFrom<VendorReferenceResolver>())
            .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.SubTotalFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.Price)))
            .ForMember(dest => dest.Tier, opt => opt.MapFrom(src => src.Type.Value))
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
             .ForMember(dest => dest.Deals, opt => opt.MapFrom<DealDetailResolver>())
            .ForMember(dest => dest.Expires, opt => opt.MapFrom(src => src.Expiry));

            CreateMap<QuoteModel, GetQuote.Response>()
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src));

            CreateMap<FindResponse<IEnumerable<QuoteModel>>, FindQuotes.Response>();

            CreateMap<QuoteModel, QuotesForGridModel>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
             .ForMember(dest => dest.CheckoutSystem, opt => opt.MapFrom<CheckOutResolver>())
             .ForMember(dest => dest.QuoteReference, opt => opt.MapFrom(src => src.Description))
             .ForMember(dest => dest.Vendor, opt => opt.MapFrom<VendorResolver>())
             .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
             .ForMember(dest => dest.Expires, opt => opt.MapFrom(src => src.Expiry))
             .ForMember(dest => dest.EndUserName, opt => opt.MapFrom(src => src.EndUser.Name))
             .ForMember(dest => dest.Deals, opt => opt.MapFrom<DealResolver>())
             .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
             .ForMember(dest => dest.QuoteValue, opt => opt.MapFrom(src => src.Price))
             .ForMember(dest => dest.FormatedQuoteValue, opt => opt.MapFrom(src => string.Format("{0:N2}", src.Price)))
             .ForMember(dest => dest.CanUpdate, opt => opt.MapFrom(src => string.Join("", "true")))
             .ForMember(dest => dest.CanCheckOut, opt => opt.MapFrom(src => string.Join("", "True")));

            CreateMap<FindResponse<IEnumerable<QuoteModel>>, GetQuotesForGrid.Response>()
                 .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Data));

            CreateMap<AccountAddress, ShipToModel>()
              .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AddressNumber))
              .ForPath(dest => dest.Address, opt => opt.MapFrom(src => src))
              ;

            CreateMap<AccountAddress, AddressModel>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AddressNumber))
             .ForMember(dest => dest.Line1, opt => opt.MapFrom(src => src.AddressLine1))
             .ForMember(dest => dest.Line2, opt => opt.MapFrom(src => src.AddressLine2))
             .ForMember(dest => dest.Line3, opt => opt.MapFrom(src => src.AddressLine3))
             .ForMember(dest => dest.PostalCode, opt => opt.MapFrom(src => src.Zip))
             .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
             .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
             ;
            CreateMap<DiscountDto, Discount>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Id));

            CreateMap<ItemDto, Line>()
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Qty))
                .ForMember(dest => dest.VendorPartNo, opt => opt.MapFrom(src => src.VendorPartNo))
                .ForMember(dest => dest.UnitListPrice, opt => opt.MapFrom(src => src.ListPrice))
                .ForMember(dest => dest.UnitListPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.ListPrice)))
                .ForMember(dest => dest.MFRNumber, opt => opt.MapFrom(src => src.VendorPartNo))
                .ForMember(dest => dest.ShortDescription, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.ExtendedPrice, opt => opt.MapFrom(src => src.TotalPurchaseCost))
                .ForMember(dest => dest.ExtendedPriceFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.TotalPurchaseCost)))
                .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Vendor))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Discounts, opt => opt.MapFrom(src => src.Discounts))
                .ForMember(dest => dest.Contract, opt => opt.MapFrom(src => src.Contract))
                .ForMember(dest => dest.DisplayLineNumber, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Invoices, opt => opt.Ignore())
                .ForMember(dest => dest.Serials, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.PAKs, opt => opt.Ignore())
                .ForMember(dest => dest.Trackings, opt => opt.Ignore())
                .ForMember(dest => dest.ShipDates, opt => opt.Ignore())
                .ForMember(dest => dest.PurchaseCost, opt => opt.MapFrom(src => src.PurchaseCost))
                .ForMember(dest => dest.Authorization, opt => opt.Ignore())
                ;

            CreateMap<SourceDto, VendorReferenceModel>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Id))
                ;
            CreateMap<EndUserDto, Address>()
                 .ForMember(dest => dest.Line1, opt => opt.MapFrom(src => src.Address.Address1))
                 .ForMember(dest => dest.Line2, opt => opt.MapFrom(src => src.Address.Address2))
                 .ForMember(dest => dest.Line3, opt => opt.MapFrom(src => src.Address.Address3))
                 .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.Address.City))
                 .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Address.Country))
                 .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.ParentCompany))
                 .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Contact.EmailAddress))
                 .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Contact.FirstName + " " + src.Contact.LastName))
                 ;

            CreateMap<ResellerDto, Address>()
                .ForMember(dest => dest.Line1, opt => opt.MapFrom(src => src.Address.Address1))
                .ForMember(dest => dest.Line2, opt => opt.MapFrom(src => src.Address.Address2))
                .ForMember(dest => dest.Line3, opt => opt.MapFrom(src => src.Address.Address3))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.Address.City))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Address.Country))
                .ForMember(dest => dest.Zip, opt => opt.MapFrom(src => src.Address.PostalCode))
                ;
            CreateMap<DetailedDto, QuotePreview>()
               .ForMember(dest => dest.ConfigurationId, opt => opt.MapFrom(src => src.Source.Id))
               .ForMember(dest => dest.ShipTo, opt => opt.Ignore())
               .ForMember(dest => dest.Reseller, opt => opt.Ignore())
               .ForMember(dest => dest.EndUser, opt => opt.Ignore())
               .ForPath(dest => dest.Source, opt => opt.MapFrom(src => src.Source))
               .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.TotalCost))
               .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
               .ForMember(dest => dest.Vendor, opt => opt.MapFrom(src => src.Vendor.Name))
               .ForMember(dest => dest.SubTotalFormatted, opt => opt.MapFrom(src => string.Format("{0:N2}", src.TotalCost)))
               .ForPath(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
               //.ForMember(dest => dest.EndUser, opt => opt.MapFrom(src => src.EndUser))
               //.ForMember(dest => dest.Reseller, opt => opt.MapFrom(src => src.Reseller))
               ;
        }
    }

    [ExcludeFromCodeCoverage]
    public class LineAttributeResolver : IValueResolver<ItemModel, Line, List<Models.Quote.AttributeModel>>
    {
        public List<Models.Quote.AttributeModel> Resolve(ItemModel source, Line destination, List<Models.Quote.AttributeModel> destMember, ResolutionContext context)
        {
            List<Models.Quote.AttributeModel> lstAttributes = new List<Models.Quote.AttributeModel>();
            if (source.Attributes != null)
            {
                foreach (var reference in source.Attributes)
                {
                    Models.Quote.AttributeModel attributeModel = new Models.Quote.AttributeModel();

                    attributeModel.Name = reference.Name = string.IsNullOrWhiteSpace(reference.Name) ? "" : reference.Name.ToUpper();
                    attributeModel.Value = reference.Value = string.IsNullOrWhiteSpace(reference.Value) ? "" : reference.Value.ToUpper();

                    lstAttributes.Add(attributeModel);
                }
            }
            return lstAttributes;
        }
    }

    [ExcludeFromCodeCoverage]
    public class VendorResolver : IValueResolver<QuoteModel, QuotesForGridModel, string>
    {
        public string Resolve(QuoteModel source, QuotesForGridModel destination, string destMember, ResolutionContext context)
        {
            var vendor = string.Empty;

            var lstVendor = source.Attributes.Any() ? source.Attributes.Where(d => d.Name.ToUpper().Equals("VENDOR")).ToList().Select(n => n.Value).ToList() : new List<string>();
            if (lstVendor.Any())
                vendor = lstVendor.Count > 1 ? "Multiple" : lstVendor.FirstOrDefault();

            return vendor;
        }
    }


    [ExcludeFromCodeCoverage]
    public class DealResolver : IValueResolver<QuoteModel, QuotesForGridModel, List<string>>
    {
        public List<string> Resolve(QuoteModel source, QuotesForGridModel destination, List<string> destMember, ResolutionContext context)
        {
            var description = source.Attributes.Any() ? source.Attributes.Where(d => d.Name.ToUpper().Equals("DEALIDENTIFIER")).ToList().Select(n => n.Value).ToList() : new List<string>();
            return description;
        }
    }
    [ExcludeFromCodeCoverage]
    public class DealDetailResolver : IValueResolver<QuoteModel, QuoteDetails, List<string>>
    {
        public List<string> Resolve(QuoteModel source, QuoteDetails destination, List<string> destMember, ResolutionContext context)
        {
            var description = source.Attributes.Any() ? source.Attributes.Where(d => d.Name.ToUpper().Equals("DEALIDENTIFIER")).ToList().Select(n => n.Value).ToList() : new List<string>();
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemMfrPartNumberResolver : IValueResolver<ItemModel, Line, string>
    {
        public string Resolve(ItemModel source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER", StringComparison.Ordinal))?.FirstOrDefault()?.Id : string.Empty;
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemTDPartNumberResolver : IValueResolver<ItemModel, Line, string>
    {
        public string Resolve(ItemModel source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA", StringComparison.Ordinal))?.FirstOrDefault()?.Id : string.Empty;
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemDescriptionResolver : IValueResolver<ItemModel, Line, string>
    {
        public string Resolve(ItemModel source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA", StringComparison.Ordinal)).FirstOrDefault()?.Name ?? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER", StringComparison.Ordinal))?.FirstOrDefault()?.Name : string.Empty;
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemManufacturerResolver : IValueResolver<ItemModel, Line, string>
    {
        public string Resolve(ItemModel source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER", StringComparison.Ordinal))?.FirstOrDefault()?.Manufacturer : string.Empty;
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class VendorReferenceResolver : IValueResolver<QuoteModel, QuoteDetails, List<VendorReferenceModel>>
    {
        public List<VendorReferenceModel> Resolve(QuoteModel source, QuoteDetails destination, List<VendorReferenceModel> destMember, ResolutionContext context)
        {
            List<VendorReferenceModel> lstVendorReference = new List<VendorReferenceModel>();
            if (source.VendorReference != null)
            {
                foreach (var reference in source.VendorReference)
                {
                    string vendorIdType = reference.Type = string.IsNullOrWhiteSpace(reference.Type) ? "" : reference.Type.ToUpper();

                    if (vendorIdType.Equals("VENDORQUOTEID"))
                        reference.Type = "Vendor Quote";
                    else if (vendorIdType.Equals("ORIGINALESTIMATEID"))
                        reference.Type = "Estimate Id";
                    else if (vendorIdType.Equals("DEALIDENTIFIER"))
                        reference.Type = "Deal";
                    else
                        reference.Type = "";


                    lstVendorReference.Add(reference);
                }
            }

            return lstVendorReference;
        }
    }

    [ExcludeFromCodeCoverage]
    public class AttributeResolver : IValueResolver<QuoteModel, QuoteDetails, List<Models.Quote.AttributeModel>>
    {
        public List<Models.Quote.AttributeModel> Resolve(QuoteModel source, QuoteDetails destination, List<Models.Quote.AttributeModel> destMember, ResolutionContext context)
        {
            List<Models.Quote.AttributeModel> lstAttributes = new List<Models.Quote.AttributeModel>();
            if (source.Attributes != null)
            {
                foreach (var reference in source.Attributes)
                {
                    Models.Quote.AttributeModel attributeModel = new Models.Quote.AttributeModel();

                    attributeModel.Name = reference.Name = string.IsNullOrWhiteSpace(reference.Name) ? "" : reference.Name.ToUpper();
                    attributeModel.Value = reference.Value = string.IsNullOrWhiteSpace(reference.Value) ? "" : reference.Value.ToUpper();

                    lstAttributes.Add(attributeModel);
                }
            }
            return lstAttributes;
        }
    }


    [ExcludeFromCodeCoverage]
    public class CheckOutResolver : IValueResolver<QuoteModel, QuotesForGridModel, string>
    {
        public string Resolve(QuoteModel source, QuotesForGridModel destination, string destMember, ResolutionContext context)
        {
            if (source?.Source?.System?.ToUpper() == "Q" && source?.Source?.TargetSystem?.ToUpper() == "ECC")
                return "6.8";
            else
                return "4.6";
        }
    }
}

