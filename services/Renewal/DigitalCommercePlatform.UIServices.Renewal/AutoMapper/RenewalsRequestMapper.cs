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
                .ForMember(x => x.Page, y => y.MapFrom(s => s.Page))
                .ForMember(x => x.PageSize, y => y.MapFrom(s => s.PageSize))
                .ForMember(x => x.EndUserEmail, y => y.MapFrom(s => s.EndUserEmail))
                .ForMember(x => x.SortAscending, y => y.MapFrom(s => s.SortAscending))
                .ForMember(x => x.WithPaginationInfo, y => y.MapFrom(s => s.WithPaginationInfo))
                .ForMember(x => x.PageSize, y => y.MapFrom(s => s.PageSize))
                .ForMember(x => x.EndUserType, y => y.MapFrom(s => s.EndUserType))
                .ForMember(x => x.Details, y => y.MapFrom(s => s.Details))
                .ForMember(x => x.VendorName, y => y.MapFrom(s => s.VendorName));

            CreateMap<SearchModel, SearchRenewalSummary.Request>()
                .ForMember(x => x.Page, y => y.MapFrom(s => s.Page))
                .ForMember(x => x.PageSize, y => y.MapFrom(s => s.PageSize))
                .ForMember(x => x.EndUserEmail, y => y.MapFrom(s => s.EndUserEmail))
                .ForMember(x => x.SortAscending, y => y.MapFrom(s => s.SortAscending))
                .ForMember(x => x.WithPaginationInfo, y => y.MapFrom(s => s.WithPaginationInfo))
                .ForMember(x => x.PageSize, y => y.MapFrom(s => s.PageSize))
                .ForMember(x => x.EndUserType, y => y.MapFrom(s => s.EndUserType))
                .ForMember(x => x.VendorName, y => y.MapFrom(s => s.VendorName));


        }
    }
}
