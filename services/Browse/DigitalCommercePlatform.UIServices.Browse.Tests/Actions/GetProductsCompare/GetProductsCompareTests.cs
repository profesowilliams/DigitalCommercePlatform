//2021 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetProductsCompare
{
    public class GetProductsCompareTests
    {
        private readonly Mock<IMiddleTierHttpClient> _httpClientMock;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Browse.Actions.GetProductsCompare.Handler _sut;

        public GetProductsCompareTests()
        {
            _httpClientMock = new Mock<IMiddleTierHttpClient>();
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(x => x.GetSetting("App.Product.Url")).Returns("http://appproduct");

            _sut = new Browse.Actions.GetProductsCompare.Handler(_httpClientMock.Object, _appSettingsMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handler_CallProductForDataAndValidate(Browse.Actions.GetProductsCompare.Request request)
        {
            //arrange
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null))
                .ReturnsAsync(Array.Empty<ProductDto>())
                .Verifiable();
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ValidateDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null))
                .ReturnsAsync(Array.Empty<ValidateDto>())
                .Verifiable();

            //act
            _ = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            _httpClientMock.Verify();
        }

        [Theory]
        [AutoDomainData]
        public async Task Handler_ProperlyCalculateSpecificationMatrix(Browse.Actions.GetProductsCompare.Request request, IEnumerable<ProductDto> productDtos)
        {
            //arrange
            productDtos.First().ExtendedSpecifications = null;

            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null))
                .ReturnsAsync(productDtos)
                .Verifiable();
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ValidateDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null))
                .ReturnsAsync(Array.Empty<ValidateDto>())
                .Verifiable();

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.SpecificationGroups.Should().HaveCount(6);
            actual.SpecificationGroups.All(x => x.Specifications.Count() == 3).Should().BeTrue();
            actual.SpecificationGroups.All(x => x.Specifications.All(s => s.Values.Count() == 3)).Should().BeTrue();
            actual.SpecificationGroups.All(x => x.Specifications.All(s => !s.IsIdentical)).Should().BeTrue();
        }

        [Theory]
        [AutoDomainData(nameof(Handler_ProperlyMapProducts_Data))]
        public async Task Handler_ProperlyMapProducts(IEnumerable<ProductDto> productDtos, IEnumerable<ValidateDto> validateDtos, ProductModel expectedProduct, Browse.Actions.GetProductsCompare.Request request)
        {
            //arrange
            request.SalesOrg = "0100";

            productDtos.First().ExtendedSpecifications = null;

            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null))
                .ReturnsAsync(productDtos)
                .Verifiable();
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ValidateDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null))
                .ReturnsAsync(validateDtos)
                .Verifiable();

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.Products.First().Should().BeEquivalentTo(expectedProduct);
        }

        public static IEnumerable<object> Handler_ProperlyMapProducts_Data()
        {
            return new[]
            {
                new object[]
                {
                    new List<ProductDto>
                    {
                        new ProductDto
                        {
                            Source=new SourceDto{ Id =  "p1", System="2"},
                            ManufacturerPartNumber="ManufacturerPartNumber1",
                            Description="Description1",
                            Indicators = new List<IndicatorDto>
                            {
                                new IndicatorDto
                                {
                                    Context = new ContextDto{ SalesOrganization="0100"},
                                    Values = new Dictionary<string, IndicatorValueDto>
                                    {
                                        {"DropShip", new IndicatorValueDto{ Value="Y"} },
                                        { "AuthRequiredPrice", new IndicatorValueDto{ Value="Y"} }
                                    }
                                },
                                new IndicatorDto
                                {
                                    Values = new Dictionary<string, IndicatorValueDto>
                                    {
                                        {"Orderable", new IndicatorValueDto{ Value="Y"} }
                                    }
                                }
                            },
                            ShortDescription="shortDescription1",

                            Images = new Dictionary<string, IEnumerable<ImageDto>>
                            {
                                { "75x75", new List<ImageDto>{ new ImageDto { Type="Product shot", Url="url"} } }
                            },
                            Stock = new StockDto
                            {
                                VendorDesignated=1,
                                Td=1,
                                Total=2
                            },
                            Plants = new List<PlantDto>
                            {
                                new PlantDto
                                {
                                    Id="Plant",
                                    Stock = new LocationStockDto
                                    {
                                        AvailableToPromise=1
                                    }
                                }
                            },
                            Price = new PriceDto
                            {
                                BasePrice=10,
                                BestPrice=1,
                                BestPriceExpiration=new DateTime(2100,1,1),
                                ListPrice= 2,
                                VolumePricing = new List<VolumePricingDto>
                                {
                                    new VolumePricingDto
                                    {
                                        MinQuantity=1,
                                        Price=3
                                    }
                                }
                            }
                        }
                    },
                    new List<ValidateDto>
                    {
                        new ValidateDto
                        {
                            Source=new DigitalFoundation.Common.Models.Source{ Id="p1", System="2"},
                            Restriction="ALLOW"
                        }
                    },
                    new ProductModel
                    {
                        Id="p1",
                        ManufacturerPartNumber="ManufacturerPartNumber1",
                        Description="Description1",
                        DisplayName = "shortDescription1",
                        ThumbnailImage="url",
                        Stock = new StockModel
                        {
                            TotalAvailable=2,
                            VendorDirectInventory=1,
                            VendorShipped=true,
                            Plants = new List<PlantModel>
                            {
                                new PlantModel
                                {
                                    Name="Plant",
                                    Quantity=1
                                }
                            }
                        },
                        Authorization= new AuthorizationModel
                        {
                            CanOrder=true,
                            CanViewPrice=true
                        },
                        Price = new PriceModel
                        {
                            BasePrice=10,
                            BestPrice=1,
                            BestPriceExpiration=new DateTime(2100,1,1),
                            ListPrice=2,
                            VolumePricing= new List<VolumePricingModel>
                            {
                                new VolumePricingModel
                                {
                                    MinQuantity=1,
                                    Price=3
                                }
                            }
                        }
                    }
                }
            };
        }
    }
}