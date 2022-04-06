//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;

namespace DigitalCommercePlatform.UIServices.Renewal.AutoMapper
{
    public class RenewalsRequestMapper : Profile
    {
        public RenewalsRequestMapper()
        {
            CreateMap<SearchModel, SearchRenewalDetailed.Request>()
                .ForMember(x => x.Id, y => y.MapFrom(s => s.Id))
                .ForMember(x => x.Page, y => y.MapFrom(s => s.PageNumber))
                .ForMember(x => x.PageSize, y => y.MapFrom(s => s.PageSize))
                .ForMember(x => x.SortBy, y => y.MapFrom(s => s.SortBy))
                .ForMember(x => x.SortBy, y => y.MapFrom(s => s.SortBy))
                .ForMember(x => x.WithPaginationInfo, y => y.MapFrom(s => s.WithPaginationInfo))
                .ForMember(x => x.Details, y => y.MapFrom(s => s.Details))
                .ForMember(x => x.SessionId, y => y.MapFrom(s => s.SessionId))
                .ForMember(x => x.EndUserEmail, y => y.MapFrom(s => s.EndUserEmail))
                .ForMember(x => x.EndUserType, y => y.MapFrom(s => s.EndUserType))
                .ForMember(x => x.Type, y => y.MapFrom(s => s.Type))
                .ForMember(x=> x.ResellerPO, y=>y.MapFrom(s=> s.VendorQuoteID))

                .ForMember(x=> x.ResellerName, y=> y.MapFrom(s=> s.ResellerName))
                .ForMember(x => x.ResellerId, y => y.MapFrom(s => s.ResellerId))
                .ForMember(x => x.DUNS, y => y.MapFrom(s => s.DUNS))
                .ForMember(x => x.VendorID, y => y.MapFrom(s => s.VendorID))
                .ForMember(x => x.VATNumber, y => y.MapFrom(s => s.VATNumber))
                .ForMember(x => x.VendorAccountName, y => y.MapFrom(s => s.VendorAccountName))
                .ForMember(x => x.VendorAccountNumber, y => y.MapFrom(s => s.VendorAccountNumber))
                .ForMember(x => x.ProgramName, y => y.MapFrom(s => s.ProgramName))
                .ForMember(x => x.ContractID, y => y.MapFrom(s => s.ContractID))
                .ForMember(x => x.CreatedFrom, y => y.MapFrom(s => s.CreatedFrom))
                .ForMember(x => x.CreatedTo, y => y.MapFrom(s => s.CreatedTo))
                .ForMember(x => x.ExpiresFrom, y => y.MapFrom(s => s.ExpiresFrom))
                .ForMember(x => x.ExpiresTo, y => y.MapFrom(s => s.ExpiresTo))
                .ForMember(x => x.DueDateFrom, y => y.MapFrom(s => s.DueDateFrom))
                .ForMember(x => x.DueDateTo, y => y.MapFrom(s => s.DueDateTo))
                .ForMember(x => x.VendorName, y => y.MapFrom(s => s.VendorName));

            CreateMap<SearchModel, SearchRenewalSummary.Request>()
                .ForMember(x => x.Id, y => y.MapFrom(s => s.Id))
                .ForMember(x => x.Page, y => y.MapFrom(s => s.PageNumber))
                .ForMember(x => x.PageSize, y => y.MapFrom(s => s.PageSize))
                .ForMember(x => x.SortBy, y => y.MapFrom(s => s.SortBy))
                .ForMember(x => x.SortBy, y => y.MapFrom(s => s.SortBy))
                .ForMember(x => x.WithPaginationInfo, y => y.MapFrom(s => s.WithPaginationInfo))
                .ForMember(x => x.Details, y => y.MapFrom(s => s.Details))
                .ForMember(x => x.SessionId, y => y.MapFrom(s => s.SessionId))
                .ForMember(x => x.EndUserEmail, y => y.MapFrom(s => s.EndUserEmail))
                .ForMember(x => x.EndUserType, y => y.MapFrom(s => s.EndUserType))
                .ForMember(x => x.Type, y => y.MapFrom(s => s.Type))

                .ForMember(x => x.ResellerName, y => y.MapFrom(s => s.ResellerName))
                .ForMember(x => x.ResellerId, y => y.MapFrom(s => s.ResellerId))
                .ForMember(x => x.DUNS, y => y.MapFrom(s => s.DUNS))
                .ForMember(x => x.VendorID, y => y.MapFrom(s => s.VendorID))
                .ForMember(x => x.VATNumber, y => y.MapFrom(s => s.VATNumber))
                .ForMember(x => x.VendorAccountName, y => y.MapFrom(s => s.VendorAccountName))
                .ForMember(x => x.VendorAccountNumber, y => y.MapFrom(s => s.VendorAccountNumber))
                .ForMember(x => x.ProgramName, y => y.MapFrom(s => s.ProgramName))
                .ForMember(x => x.ContractID, y => y.MapFrom(s => s.ContractID))
                .ForMember(x => x.CreatedFrom, y => y.MapFrom(s => s.CreatedFrom))
                .ForMember(x => x.CreatedTo, y => y.MapFrom(s => s.CreatedTo))
                .ForMember(x => x.ExpiresFrom, y => y.MapFrom(s => s.ExpiresFrom))
                .ForMember(x => x.ExpiresTo, y => y.MapFrom(s => s.ExpiresTo))
                .ForMember(x => x.DueDateFrom, y => y.MapFrom(s => s.DueDateFrom))
                .ForMember(x => x.DueDateTo, y => y.MapFrom(s => s.DueDateTo))
                .ForMember(x => x.ResellerPO, y => y.MapFrom(s => s.VendorQuoteID))
                .ForMember(x => x.VendorName, y => y.MapFrom(s => s.VendorName));
        }

        private static bool ConvertSortDirection(string value) => value?.ToLowerInvariant() == "asc";
    }
}
