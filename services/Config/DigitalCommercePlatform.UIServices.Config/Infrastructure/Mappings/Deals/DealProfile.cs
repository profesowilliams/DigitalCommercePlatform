using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals.Resolvers;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Models.Deals.Internal;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals
{
    [ExcludeFromCodeCoverage]
    public class DealProfile : Profile
    {       
        public DealProfile()
        {
            CreateMap<Paginated, Models.Deals.Internal.FindModel>()
                .Include<Models.Deals.FindModel, Models.Deals.Internal.FindModel>()
                .ForMember(d => d.Page, o => o.MapFrom(s => s.PageNumber))
                .ForMember(d => d.SortBy, o => o.Ignore())
                .ForMember(d => d.SortByAscending, o => o.Ignore())
                .ForMember(d => d.DealId, o => o.Ignore())
                .ForMember(d => d.VendorBid, o => o.Ignore())
                .ForMember(d => d.VendorName, o => o.Ignore())
                .ForMember(d => d.EndUserName, o => o.Ignore())
                .ForMember(d => d.Market, o => o.Ignore())
                .ForMember(d => d.Pricing, o => o.Ignore())
                .ForMember(d => d.CreatedFrom, o => o.Ignore())
                .ForMember(d => d.CreatedTo, o => o.Ignore())
                .ForMember(d => d.ExpiresFrom, o => o.Ignore())
                .ForMember(d => d.ExpiresTo, o => o.Ignore())
                .ForMember(d => d.WithPaginationInfo, o => o.Ignore())
                ;
            
            CreateMap<Models.Deals.FindModel, Models.Deals.Internal.FindModel>()
                .ForMember(d => d.SortBy, o => o.MapFrom(s => s.SortBy))
                .ForMember(d => d.SortByAscending, o => o.MapFrom<SortByResolver>())
                .ForMember(d => d.DealId, o => o.MapFrom(s => s.DealId))
                .ForMember(d => d.VendorBid, o => o.MapFrom(s => s.VendorBid))
                .ForMember(d => d.VendorName, o => o.MapFrom(s => s.VendorName))
                .ForMember(d => d.EndUserName, o => o.MapFrom(s => s.EndUserName))
                .ForMember(d => d.Market, o => o.MapFrom(s => s.Market))
                .ForMember(d => d.Pricing, o => o.MapFrom(s => s.Pricing))
                .ForMember(d => d.CreatedFrom, o => o.MapFrom(s => s.CreatedFrom))
                .ForMember(d => d.CreatedTo, o => o.MapFrom(s => s.CreatedTo))
                .ForMember(d => d.ExpiresFrom, o => o.MapFrom(s => s.ExpiresFrom))
                .ForMember(d => d.ExpiresTo, o => o.MapFrom(s => s.ExpiresTo))
                .ForMember(d => d.WithPaginationInfo, o => o.Ignore())
                ;

            CreateMap<AppServiceDeal, Deal>();

            CreateMap<DealsDetailModel, GetDeal.Response>()
                .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src));
        }
    }
}
