//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Enums;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles
{
    public class SearchProfile : Profile
    {
        private const string N = "N";
        private const string Orderable = "Orderable";
        private const string AuthRequiredPrice = "AuthRequiredPrice";
        private const string Y = "Y";

        public SearchProfile()
        {
            CreateMap<RangeModel, RangeDto>();
            CreateMap<RefinementRequestModel, Dto.FullSearch.Internal.RefinementRequestDto>();
            CreateMap<RefinementGroupRequestModel, RefinementGroupRequestDto>();
            CreateMap<RangeFilterModel, RangeFilterDto>();
            CreateMap<SortRequestModel, SortRequestDto>();
            CreateMap<FullSearchRequestModel, SearchRequestDto>()
                .ForMember(dest => dest.RangeFilters, opt => opt.Ignore())
                .ForMember(dest => dest.GetDetails, opt => opt.Ignore());
            CreateMap<MainSpecificationDto, MainSpecificationModel>();
            CreateMap<ImageDto, ImageModel>();
            CreateMap<ElasticPriceDto, ElasticPriceModel>();
            CreateMap<PriceDto, PriceModel>()
                .ForMember(dest => dest.VolumePricing, opt => opt.Ignore())
                .ForMember(dest => dest.PromoAmount, opt => opt.Ignore());
            CreateMap<ProductNoteDto, ProductNoteModel>();
            CreateMap<SalesOrgStocksDto, StockModel>()
                .ForMember(dest => dest.TotalAvailable, opt => opt.MapFrom(x => x.Total))
                .ForMember(dest => dest.VendorDirectInventory, opt => opt.Ignore())
                .ForMember(dest => dest.VendorDirectInventory, opt => opt.Ignore())
                .ForMember(dest => dest.VendorShipped, opt => opt.Ignore());
            CreateMap<ElasticItemDto, ElasticItemModel>()
                .ForMember(dest => dest.Plants, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.IsSelectedForCompare, opt => opt.Ignore())
                .ForMember(dest => dest.IsFavorite, opt => opt.Ignore())
                .ForMember(dest => dest.IsExactMatch, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(x => x.LongDescription))
                .ForMember(dest => dest.Upc, opt => opt.MapFrom(x => x.UpcEan))
                .ForMember(dest => dest.ProductImages, opt => opt.MapFrom(x => x.ProductImages.FirstOrDefault().Value))
                .ForMember(dest => dest.Authorization, opt => opt.Ignore())
                .ForMember(dest => dest.Indicators, opt => opt.Ignore());
            CreateMap<CategoryBreadcrumbDto, CategoryBreadcrumbModel>();
            CreateMap<RefinementOptionDto, RefinementOptionModel>();
            CreateMap<RangeDto, RangeModel>();
            CreateMap<Dto.FullSearch.Internal.RefinementDto, RefinementModel>();
            CreateMap<RefinementGroupResponseDto, RefinementGroupResponseModel>();
            CreateMap<AlternateSearchSuggestionDto, AlternateSearchSuggestionModel>();
            CreateMap<SearchReportDto, SearchReportModel>();
            CreateMap<SearchResponseDto, FullSearchResponseModel>()
                .ForMember(dest => dest.RefinementsToDisplay, opt => opt.Ignore())
                .ForMember(dest => dest.TopRefinements, opt => opt.Ignore())
                ;

            CreateMap<Dto.Content.ContentSearchResponseDto, Models.Content.FullSearchResponseModel>();
            CreateMap<Dto.Content.Internal.RefinementDto, Models.Content.Internal.RefinementModel>();
            CreateMap<Dto.Content.Internal.OptionDto, Models.Content.Internal.Option>();
            CreateMap<Dto.Content.Internal.SearchResultDto, Models.Content.SearchResult>();

            CreateMap<Models.Content.FullSearchRequestModel, FullSearchRequestDto>()
                .ForMember(dest => dest.SearchString, opt => opt.MapFrom(x => x.Keyword));
            CreateMap<Models.Content.Internal.RefinementRequestModel, Dto.Content.Internal.RefinementRequestDto>();

            CreateMap<ExportRequestModel, SearchRequestDto>()
                .ForMember(dest => dest.Page, opt => opt.MapFrom(src => 1))
                .ForMember(dest => dest.PageSize, opt => opt.Ignore()) //will be set in action handler
                .ForMember(dest => dest.RangeFilters, opt => opt.Ignore())
                .ForMember(dest => dest.GetDetails, opt => opt.MapFrom(src => new Dictionary<Details, bool> { { Details.Authorizations, false }, { Details.Price, true }, { Details.Refinements, false } }))
                .ForMember(dest => dest.RefinementGroups, opt => opt.MapFrom(src => src.RefinementGroups))
                .ForMember(dest => dest.SearchString, opt => opt.MapFrom(src => src.SearchString))
                .ForMember(dest => dest.Sort, opt => opt.MapFrom(src => src.Sort))
                .ForMember(dest => dest.Territories, opt => opt.MapFrom(src => src.Territories))
                .ForMember(dest => dest.Countries, opt => opt.MapFrom(src => src.Countries))
            ;

            CreateMap<IndicatorDto, IndicatorModel>();
        }

        public static (bool orderable, bool authrequiredprice) GetFlags(ElasticItemDto x)
        {
            var orderable = false;
            var authrequiredprice = false;

            orderable = x.Indicators?.FirstOrDefault(i => string.Equals(i.Type, Orderable, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value, N, StringComparison.InvariantCultureIgnoreCase)) == null
                                                              && x.Indicators?.FirstOrDefault(i => string.Equals(i.Type, Orderable, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value, Y, StringComparison.InvariantCultureIgnoreCase)) != null;

            authrequiredprice = x.Indicators?.FirstOrDefault(i => string.Equals(i.Type, AuthRequiredPrice, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value, Y, StringComparison.InvariantCultureIgnoreCase)) != null;

            return (orderable, authrequiredprice);
        }

        public static void MapAuthorizations(ElasticItemModel product, bool isValid, bool orderable, bool authrequiredprice)
        {
            product.Authorization = new AuthorizationModel
            {
                CanOrder = isValid && orderable,
                CanViewPrice = isValid || !authrequiredprice
            };
        }
    }
}