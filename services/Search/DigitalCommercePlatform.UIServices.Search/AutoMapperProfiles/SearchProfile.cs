//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.App;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles
{
    public class SearchProfile : Profile
    {
        public SearchProfile()
        {
            CreateMap<Models.FullSearch.Internal.RangeModel, Models.FullSearch.App.Internal.RangeModel>();
            CreateMap<Models.FullSearch.Internal.RefinementRequestModel, Models.FullSearch.App.Internal.RefinementRequestModel>();
            CreateMap<Models.FullSearch.Internal.RefinementGroupRequestModel, Models.FullSearch.App.Internal.RefinementGroupRequestModel>();
            CreateMap<Models.FullSearch.Internal.RangeFilterModel, Models.FullSearch.App.Internal.RangeFilterModel>();
            CreateMap<Models.FullSearch.Internal.SortRequestModel, Models.FullSearch.App.Internal.SortRequestModel>();
            CreateMap<FullSearchRequestModel, AppSearchRequestModel>()
                .ForMember(dest => dest.RangeFilters, opt => opt.Ignore())
                .ForMember(dest => dest.GetDetails, opt => opt.Ignore());
            CreateMap<Dto.FullSearch.Internal.MainSpecificationDto, Models.FullSearch.Internal.MainSpecificationModel>();
            CreateMap<Dto.FullSearch.Internal.ImageDto, Models.FullSearch.Internal.ImageModel>();
            CreateMap<Dto.FullSearch.Internal.ElasticPriceDto, Models.FullSearch.Internal.ElasticPriceModel>();
            CreateMap<Dto.FullSearch.Internal.PriceDto, Models.FullSearch.Internal.PriceModel>()
                .ForMember(dest => dest.VolumePricing, opt => opt.Ignore())
                .ForMember(dest => dest.PromoAmount, opt => opt.Ignore());
            CreateMap<Dto.FullSearch.Internal.ProductNoteDto, Models.FullSearch.Internal.ProductNoteModel>();
            CreateMap<Dto.FullSearch.Internal.SalesOrgStocksDto, Models.FullSearch.Internal.StockModel>()
                .ForMember(dest => dest.TotalAvailable, opt => opt.MapFrom(x => x.Total))
                .ForMember(dest => dest.VendorDirectInventory, opt => opt.Ignore())
                .ForMember(dest => dest.VendorDirectInventory, opt => opt.Ignore())
                .ForMember(dest => dest.VendorShipped, opt => opt.Ignore());
            CreateMap<Dto.FullSearch.Internal.ElasticItemDto, Models.FullSearch.Internal.ElasticItemModel>()
                .ForMember(dest => dest.Plants, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.IsSelectedForCompare, opt => opt.Ignore())
                .ForMember(dest => dest.IsFavorite, opt => opt.Ignore())
                .ForMember(dest => dest.IsExactMatch, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(x => x.LongDescription))
                .ForMember(dest => dest.Upc, opt => opt.MapFrom(x => x.UpcEan))
                .ForMember(dest => dest.ProductImages, opt => opt.MapFrom(x => x.ProductImages.FirstOrDefault().Value));
            CreateMap<Dto.FullSearch.Internal.CategoryBreadcrumbDto, Models.FullSearch.Internal.CategoryBreadcrumbModel>();
            CreateMap<Dto.FullSearch.Internal.RefinementOptionDto, Models.FullSearch.Internal.RefinementOptionModel>();
            CreateMap<Dto.FullSearch.Internal.RangeDto, Models.FullSearch.Internal.RangeModel>();
            CreateMap<Dto.FullSearch.Internal.RefinementDto, Models.FullSearch.Internal.RefinementModel>()
                .ForMember(dest => dest.Priority, opt => opt.Ignore());
            CreateMap<Dto.FullSearch.Internal.RefinementGroupResponseDto, Models.FullSearch.Internal.RefinementGroupResponseModel>();
            CreateMap<Dto.FullSearch.Internal.AlternateSearchSuggestionDto, Models.FullSearch.Internal.AlternateSearchSuggestionModel>();
            CreateMap<Dto.FullSearch.Internal.SearchReportDto, Models.FullSearch.Internal.SearchReportModel>();
            CreateMap<AppSearchResponseDto, FullSearchResponseModel>()
                .ForMember(dest => dest.RefinementsToDisplay, opt => opt.Ignore());

            CreateMap<Dto.Content.ContentSearchResponseDto, Models.Content.FullSearchResponseModel>();
            CreateMap<Dto.Content.Internal.RefinementDto, Models.Content.Internal.RefinementModel>();
            CreateMap<Dto.Content.Internal.OptionDto, Models.Content.Internal.Option>();
            CreateMap<Dto.Content.Internal.SearchResultDto, Models.Content.SearchResult>();

            CreateMap<Models.Content.FullSearchRequestModel, Models.Content.App.AppFullSearchRequestModel>()
                .ForMember(dest => dest.SearchString, opt => opt.MapFrom(x => x.Keyword));
            CreateMap<Models.Content.Internal.RefinementRequestModel, Models.Content.App.Internal.RefinementRequestModel>();
        }
    }
}