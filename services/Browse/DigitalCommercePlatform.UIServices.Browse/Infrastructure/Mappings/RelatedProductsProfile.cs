//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductsProfile : Profile
    {
        public RelatedProductsProfile()
        {
            CreateMap<RelatedProductResponseDto, RelatedProductResponseModel>()
                .ForMember(dest => dest.ProductTypes, opt => opt.MapFrom(src => src.Product))
                .AfterMap<SpecificationsForSimilarProductsAction>();


            CreateMap<TypeDto, TypeModel>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Categories));

            CreateMap<ProductDto, ProductModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.Id))
                .ForMember(dest => dest.Authorization, opt => opt.MapFrom(src => new AuthorizationModel() { CanOrder = true }))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity.Format()));

            CreateMap<CategoryDto, CategoryModel>()
                .ForMember(dest => dest.MainSpecifications, opt => opt.Ignore());


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
            private readonly IPriceService _priceService;

            public PriceAfterMapAction(ITranslationService translationService, IPriceService priceService)
            {
                _translationService = translationService;
                Dictionary<string, string> translations = null;
                _translationService.FetchTranslations(TransaltionsConst.BrowseUIName, ref translations);
                _naLabel = _translationService.Translate(translations, TransaltionsConst.NALabel);
                _priceService = priceService;
            }

            public void Process(PriceDto source, PriceModel destination, ResolutionContext context)
            {
                destination.ListPrice = _priceService.GetListPrice(source.ListPrice, _naLabel, source.ListPriceAvailable);
            }
        }
    }

    public class SpecificationsForSimilarProductsAction : IMappingAction<RelatedProductResponseDto, RelatedProductResponseModel>
    {
        public const string SimilarProductsType = "SIMILAR";

        public void Process(RelatedProductResponseDto source, RelatedProductResponseModel destination, ResolutionContext context)
        {
            if (destination?.ProductTypes == null)
            {
                return;
            }

            foreach (string productId in destination.ProductTypes.Keys)
            {
                (List<ProductModel> products, List<SpecificationModel> specifications) = GetSimilarProductsAndTheirSpecifications(destination, productId);

                List<CategoryModel> category = GetModelForSimilarProductsWithoutMainSpecificationsCategoryIdAndName(products, specifications);

                TypeModel similarProductsType = destination.ProductTypes[productId].SingleOrDefault(i => SimilarProductsType.Equals(i.Type, StringComparison.OrdinalIgnoreCase));

                if (similarProductsType != null)
                {
                    similarProductsType.Value = category;
                }
            }
        }

        private static (List<ProductModel> products, List<SpecificationModel> specifications) GetSimilarProductsAndTheirSpecifications(RelatedProductResponseModel relatedProducts, string productId)
        {
            List<TypeModel> parentProduct = relatedProducts.ProductTypes[productId];
            
            TypeModel similarProductsType = parentProduct?.SingleOrDefault(i => SimilarProductsType.Equals(i.Type, StringComparison.OrdinalIgnoreCase));

            if (similarProductsType?.Value == null || !similarProductsType.Value.Any())
            {
                return (new List<ProductModel>(), new List<SpecificationModel>());
            }

            var products = similarProductsType.Value.Where(c => c.Products != null).SelectMany(v => v.Products).ToList();

            var mainSpecifications = products.Where(p => p.MainSpecifications != null).SelectMany(p => p.MainSpecifications).ToList();

            var grouped = mainSpecifications.GroupBy(p => p.Name).Select(g => new SpecificationModel
            {
                Name = g.Key,
                Values = GetSpecificationsItems(g.Select(i => new SpecificationItemModel { Value = i.Value, MatchesParent = i.MatchesParent }).ToList(), products, g.Key)
            }).ToList();

            return (products, grouped);
        }

        private static List<CategoryModel> GetModelForSimilarProductsWithoutMainSpecificationsCategoryIdAndName(List<ProductModel> products, List<SpecificationModel> specifications)
        {
            if (products == null || !products.Any())
            {
                return new List<CategoryModel>();
            }
            return new List<CategoryModel>
                    {
                        new CategoryModel
                        {
                            CategoryId = null,
                            Name = null,
                            Products = products.Select(p => new ProductModel
                            {
                                Authorization = p.Authorization,
                                DisplayName = p.DisplayName,
                                Id = p.Id,
                                MainSpecifications = null,
                                ManufacturerPartNumber = p.ManufacturerPartNumber,
                                Pricing = p.Pricing,
                                Quantity = p.Quantity,
                                ServicePriority = p.ServicePriority,
                                ThumbnailImage = p.ThumbnailImage
                            }).ToList(),
                            MainSpecifications = specifications
                        }
                    };
        }

        private static List<SpecificationItemModel> GetSpecificationsItems(List<SpecificationItemModel> specifications, List<ProductModel> products, string key)
        {
            if (specifications.Count == products.Count)
            {
                return specifications;
            }

            var specificationsForEveryProduct = new List<SpecificationItemModel>();

            foreach (var productItem in products)
            {
                var specification = productItem.MainSpecifications?.SingleOrDefault(ms => ms.Name == key);

                if (specification != null)
                {
                    specificationsForEveryProduct.Add(new SpecificationItemModel { Value = specification.Value, MatchesParent = specification.MatchesParent });
                }
                else
                {
                    specificationsForEveryProduct.Add(new SpecificationItemModel { Value = string.Empty, MatchesParent = false });
                }
            }

            return specificationsForEveryProduct;
        }
    }
}