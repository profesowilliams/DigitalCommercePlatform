//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using static DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings.RelatedProductsProfile;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper
{
    public class RelatedProductsProfileTests
    {
        [Fact]
        public void RelatedProductsProfileTestIsValid()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<RelatedProductsProfile>());
            config.AssertConfigurationIsValid();
        }

        [Fact]
        public void RelatedProductsProfileTestPriceDto()
        {
            //arrange
            var services = new ServiceCollection().AddLogging();
            services.AddSingleton<PriceAfterMapAction>();
            services.AddSingleton(Mock.Of<ITranslationService>());
            services.AddAutoMapper(cfg => cfg.AddProfile<RelatedProductsProfile>());
            var serviceProvider = services.BuildServiceProvider();
            var mapper = serviceProvider.GetService<IMapper>();

            var priceDto = new PriceDto()
            {
                BestPriceExpiration = DateTime.MaxValue,
            };
            //act
            var result = mapper.Map<PriceModel>(priceDto);
            //assert
            result.BestPriceExpiration.Should().Be(DateOnly.MaxValue.ToString());
        }

        [Fact]
        public void Response_model_stayed_null_when_related_product_response_model_is_null()
        {
            RelatedProductResponseModel relatedProductResponseModel = null;
            var sut = new SpecificationsForSimilarProductsAction();

            sut.Process(null, relatedProductResponseModel, null);

            relatedProductResponseModel.Should().BeNull();
        }

        [Fact]
        public void Product_types_stayed_null_when_product_types_is_null()
        {
            var relatedProductResponseModel = new RelatedProductResponseModel();
            relatedProductResponseModel.ProductTypes = null;
            var sut = new SpecificationsForSimilarProductsAction();

            sut.Process(null, relatedProductResponseModel, null);

            relatedProductResponseModel.Should().NotBeNull();
            relatedProductResponseModel.ProductTypes.Should().BeNull();
        }

        [Fact]
        public void Product_types_stayed_empty_when_product_types_is_empty()
        {
            var relatedProductResponseModel = new RelatedProductResponseModel();
            relatedProductResponseModel.ProductTypes = new Dictionary<string, List<TypeModel>>();
            var sut = new SpecificationsForSimilarProductsAction();

            sut.Process(null, relatedProductResponseModel, null);

            relatedProductResponseModel.Should().NotBeNull();
            relatedProductResponseModel.ProductTypes.Should().NotBeNull();
            relatedProductResponseModel.ProductTypes.Keys.Should().NotBeNull();
            relatedProductResponseModel.ProductTypes.Keys.Count.Should().Be(0);
        }


        [Fact]
        public void Response_model_has_products_and_specifications()
        {
            //arange
            var typeModels = new List<TypeModel>
            {
                new TypeModel
                {
                    Type = "SIMILAR",
                    Value = new List<CategoryModel>
                    {
                        new CategoryModel
                        {
                            Products = new List<ProductModel>
                            {
                                new ProductModel
                                {
                                    MainSpecifications = new List<MainSpecificationModel>
                                    {
                                        new MainSpecificationModel
                                        {
                                            Name = "Wireless Receiver", MatchesParent = true, Value = "Logitech Unifying receiver"
                                        },
                                        new MainSpecificationModel
                                        {
                                            Name = "Connectivity Technology", MatchesParent = true, Value = "Wireless"
                                        }
                                    }
                                },
                                new ProductModel
                                {
                                    MainSpecifications = new List<MainSpecificationModel>
                                    {
                                        new MainSpecificationModel
                                        {
                                            Name = "Input Device", MatchesParent = true, Value = "Keyboard"
                                        },
                                        new MainSpecificationModel
                                        {
                                            Name = "Pointing Device", MatchesParent = false, Value = "Mouse - wireless - optical"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };


            var relatedProductResponseModel = new RelatedProductResponseModel
            {
                ProductTypes = new Dictionary<string, List<TypeModel>>
                {
                    { "12243396", typeModels }
                }
            };

            var sut = new SpecificationsForSimilarProductsAction();

            //act
            sut.Process(null, relatedProductResponseModel, null);

            //assert
            var similarProductsType = relatedProductResponseModel.ProductTypes["12243396"].SingleOrDefault(i => i.Type == SpecificationsForSimilarProductsAction.SimilarProductsType);
            similarProductsType.Should().NotBeNull();
            similarProductsType.Value.Should().NotBeNull();

            similarProductsType.Value.First().Products.Count.Should().Be(2);
            similarProductsType.Value.First().MainSpecifications.Count.Should().Be(4);
            
            similarProductsType.Value.First().MainSpecifications.First().Name.Should().Be("Wireless Receiver");
            similarProductsType.Value.First().MainSpecifications.First().Values.Count().Should().Be(2);
            
            similarProductsType.Value.First().MainSpecifications.First().Values.First().MatchesParent.Should().Be(true);
            similarProductsType.Value.First().MainSpecifications.First().Values.First().Value.Should().Be("Logitech Unifying receiver");
            
            similarProductsType.Value.First().MainSpecifications.First().Values.ElementAt(1).MatchesParent.Should().Be(false);
            similarProductsType.Value.First().MainSpecifications.First().Values.ElementAt(1).Value.Should().Be(string.Empty);
        }
    }
}