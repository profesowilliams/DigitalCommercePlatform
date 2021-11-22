//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;
using DigitalFoundation.App.Services.Renewal.Dto.CoreQuote.Internal;
using System.Globalization;

namespace DigitalCommercePlatform.UIServices.Renewal.AutoMapper
{
    public class RenewalsMapper : Profile
    {
        public RenewalsMapper()
        {
            var culture = CultureInfo.InvariantCulture.Clone() as CultureInfo;

            culture.NumberFormat.NumberDecimalSeparator = ".";
            CreateMap<AddressDto, AddressModel>();
            CreateMap<VendorDto, VendorModel>();
            CreateMap<AgreementDto, QuoteAgreementModel>();
            CreateMap<AttributeDto, AttributeModel>();
            CreateMap<ContactDto, ContactModel>();
            CreateMap<ContractDto, ContractModel>();
            CreateMap<NameDto, NameModel>();
            CreateMap<ValueDto, ValueModel>();
            CreateMap<ItemDto, ItemModel>();
            CreateMap<OrderDto, OrderModel>();
            CreateMap<PartyDto, PartyModel>();
            CreateMap<ProductDto, ProductModel>();
            CreateMap<SalesTeamDto, SalesTeamModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<TypeValueDto, QuoteTypeValueModel>();
            CreateMap<DetailedDto, DetailedModel>();
            CreateMap<SummaryDto, SummaryModel>();
            CreateMap<PartyDetailedDto, PartyDetailedModel>();
            CreateMap<ContactDetailedDto, ContactDetailedModel>();
            CreateMap<QuoteDetailedDto, QuoteDetailedModel>();
            CreateMap<QuoteSourceDto, QuoteSourceModel>();
            CreateMap<RenewalInRuleDto, RenewalInRuleModel>();
            CreateMap<OptionsDto, OptionsModel>();
        }
    }
}
