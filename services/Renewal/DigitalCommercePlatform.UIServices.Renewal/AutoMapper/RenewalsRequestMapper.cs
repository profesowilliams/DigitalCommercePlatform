//2022 (c) Tech Data Corporation -. All Rights Reserved.
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
                .ForMember(x => x.Page, y => y.MapFrom(s => s.PageNumber))
                .ForMember(x => x.ResellerPO, y => y.MapFrom(s => s.VendorQuoteID));

            CreateMap<SearchModel, SearchRenewalSummary.Request>()
                .ForMember(x => x.Page, y => y.MapFrom(s => s.PageNumber))
                .ForMember(x => x.ResellerPO, y => y.MapFrom(s => s.VendorQuoteID));
        }
    }
}
