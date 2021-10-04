//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.App;
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
            CreateMap<RangeModel, Models.FullSearch.App.Internal.RangeModel>();
            CreateMap<RefinementRequestModel, Models.FullSearch.App.Internal.RefinementRequestModel>();
            CreateMap<RefinementGroupRequestModel, Models.FullSearch.App.Internal.RefinementGroupRequestModel>();
            CreateMap<RangeFilterModel, Models.FullSearch.App.Internal.RangeFilterModel>();
            CreateMap<SortRequestModel, Models.FullSearch.App.Internal.SortRequestModel>();
            CreateMap<FullSearchRequestModel, AppSearchRequestModel>()
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
                .ForMember(dest => dest.Authorization, opt => opt.Ignore());
            CreateMap<CategoryBreadcrumbDto, CategoryBreadcrumbModel>();
            CreateMap<RefinementOptionDto, RefinementOptionModel>();
            CreateMap<RangeDto, RangeModel>();
            CreateMap<RefinementDto, RefinementModel>()
                .ForMember(dest => dest.Priority, opt => opt.Ignore());
            CreateMap<RefinementGroupResponseDto, RefinementGroupResponseModel>();
            CreateMap<AlternateSearchSuggestionDto, AlternateSearchSuggestionModel>();
            CreateMap<SearchReportDto, SearchReportModel>();
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
            product.Authorization = new AuthorizationModel();
            product.Authorization.CanOrder = isValid && orderable;
            product.Authorization.CanViewPrice = isValid || !authrequiredprice;
        }
    }
}