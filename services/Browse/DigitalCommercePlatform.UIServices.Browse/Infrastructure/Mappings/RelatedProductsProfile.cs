//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductsProfile : Profile
    {
        public RelatedProductsProfile()
        {
            CreateMap<RelatedProductResponseDto, RelatedProductResponseModel>()
                .ForMember(dest => dest.ProductTypes, opt => opt.MapFrom(src => src.Product));

            CreateMap<TypeDto, TypeModel>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Categories));

            CreateMap<ProductDto, ProductModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.Id))
                .ForMember(dest => dest.Authorization, opt => opt.MapFrom(src => new AuthorizationModel() { CanOrder = true }))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity.Format()));

            CreateMap<CategoryDto, CategoryModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<PriceDto, PriceModel>()
                .ForMember(dest => dest.BasePrice, opt => opt.MapFrom(src => src.BasePrice.Format()))
                .ForMember(dest => dest.BestPriceExpiration, opt => opt.MapFrom(src => src.BestPriceExpiration.Format()))
                .ForMember(dest => dest.BestPrice, opt => opt.MapFrom(src => src.BestPrice.Format()))
                .ForMember(dest => dest.ListPrice, opt => opt.Ignore())
                .ForMember(dest => dest.PromoAmount, opt => opt.MapFrom(src => FormatHelper.FormatSubtraction(src.BasePrice, src.BestPrice)))
                .AfterMap<PriceAfterMapAction>();

            CreateMap<MainSpecificationDto, MainSpecificationModel>();
        }

        public class PriceAfterMapAction : IMappingAction<PriceDto, PriceModel>
        {
            private readonly string _naLabel;
            private readonly ITranslationService _translationService;

            public PriceAfterMapAction(ITranslationService translationService)
            {
                _translationService = translationService;
                Dictionary<string, string> translations = null;
                _translationService.FetchTranslations(TransaltionsConst.BrowseUIName, ref translations);
                _naLabel = _translationService.Translate(translations, TransaltionsConst.NALabel);
            }

            public void Process(PriceDto source, PriceModel destination, ResolutionContext context)
            {
                destination.ListPrice = source.ListPrice.Format(_naLabel);
            }
        }
    }
}