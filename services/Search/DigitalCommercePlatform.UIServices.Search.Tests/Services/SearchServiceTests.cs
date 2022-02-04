//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Search.Helpers.IndicatorsConstants;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class SearchServiceTests
    {
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<IUIContext> _context;
        private readonly FakeLogger<SearchService> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly SearchService _searchService;
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly Mock<ITranslationService> _translationServiceMock;
        private readonly Mock<ICultureService> _cultureServiceMock;


        public SearchServiceTests()
        {
            _logger = new FakeLogger<SearchService>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("Search.App.Url")).Returns("http://app-Search/v1");
            _siteSettingsMock = new Mock<ISiteSettings>();
            _siteSettingsMock.Setup(s => s.GetSetting<List<string>>("Search.UI.RefinementsGroupThatShouldBeLocalized")).Returns(
                new List<string>
                {
                    "AvailabilityType","Price","InStock","Condition","ProductStatus","AuthorizedOnly"
                });
            _context = new Mock<IUIContext>();
            var mapper = new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())).CreateMapper();

            _translationServiceMock = new Mock<ITranslationService>();
            _cultureServiceMock = new Mock<ICultureService>();


            _searchService = new SearchService(new(_middleTierHttpClient.Object, _logger, _appSettingsMock.Object, _context.Object, _siteSettingsMock.Object, mapper, _translationServiceMock.Object, _cultureServiceMock.Object));
        }

        [Theory]
        [AutoDomainData]
        public async Task FullSearchProduct_StockNull(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            appResponse.Products[0].Indicators = new()
            {
                new Dto.FullSearch.Internal.IndicatorDto
                {
                    Type = DropShip,
                    Value = Y
                },
                new Dto.FullSearch.Internal.IndicatorDto
                {
                    Type = Warehouse,
                    Value = N
                }
            };
            appResponse.Products[0].Stock = null;
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();
            result.Products[0].Stock.Should().BeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FullSearchProduct_Price_Is_Formatted(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            decimal basePrice = 100;
            decimal bestPrice = 80;
            DateTime bestPriceExpiration = new DateTime(2022, 02, 04);
            bool bestPriceIncludesWebDiscount = true;
            decimal listPrice = 120;
            decimal promoAmmount = 20;
            string culture = "pl-PL";

            appResponse.Products.First().Price = new PriceDto
            {
                    BasePrice = basePrice,
                    BestPrice = bestPrice,
                    BestPriceExpiration = bestPriceExpiration, 
                    BestPriceIncludesWebDiscount = bestPriceIncludesWebDiscount,
                    ListPrice = listPrice
            };

            var cultureInfo = CultureInfo.GetCultureInfo(culture);
            var formattedBasePrice = String.Format(cultureInfo, "{0:C}", basePrice);
            var formattedBestPrice = String.Format(cultureInfo, "{0:C}", bestPrice);
            var formattedListPrice = String.Format(cultureInfo, "{0:C}", listPrice);
            var formattedPromoAmmount = String.Format(cultureInfo, "{0:C}", promoAmmount);
            var formattedPriceExpiration = bestPriceExpiration.ToString(cultureInfo);


            request.Culture = culture;
            var fakeLogger = new FakeLogger<SearchService>();
            var appSettingsMock = new Mock<IAppSettings>();
            var siteSettingsMock = new Mock<ISiteSettings>();
            var contextMock = new Mock<IUIContext>();
            var mapper = new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())).CreateMapper();
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();

            var middleTierHttpClientMock = new Mock<IMiddleTierHttpClient>();
            middleTierHttpClientMock.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));

            var cultureService = new CultureService(profileServiceMock.Object, siteSettingsMock.Object);

            var searchService = new SearchService(new(middleTierHttpClientMock.Object, fakeLogger, appSettingsMock.Object, 
                contextMock.Object, siteSettingsMock.Object, mapper, translationServiceMock.Object, cultureService));

            //Act
            var result = await searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();
            result.Products.Should().NotBeNull();
            result.Products.First().Price.Should().NotBeNull();
            result.Products.First().Price.BasePrice.Should().Be(formattedBasePrice);
            result.Products.First().Price.BestPrice.Should().Be(formattedBestPrice);
            result.Products.First().Price.BestPriceExpiration.Should().Be(formattedPriceExpiration);
            result.Products.First().Price.BestPriceIncludesWebDiscount.Should().Be(bestPriceIncludesWebDiscount);
            result.Products.First().Price.ListPrice.Should().Be(formattedListPrice);
            result.Products.First().Price.PromoAmount.Should().Be(formattedPromoAmmount);
        }

        [Theory]
        [AutoDomainData]
        public async Task FullSearchProduct_Price_ListPrice_Is_NA(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            const string NALabel = "NA";
            appResponse.Products.First().Price = null;

            var fakeLogger = new FakeLogger<SearchService>();
            var appSettingsMock = new Mock<IAppSettings>();
            var siteSettingsMock = new Mock<ISiteSettings>();
            var contextMock = new Mock<IUIContext>();
            var mapper = new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())).CreateMapper();
            
            var translationServiceMock = new Mock<ITranslationService>();
            translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>())).Returns(NALabel);


            var profileServiceMock = new Mock<IProfileService>();
            var cultureServiceMock = new Mock<ICultureService>();


            var middleTierHttpClientMock = new Mock<IMiddleTierHttpClient>();
            middleTierHttpClientMock.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));


            var searchService = new SearchService(new(middleTierHttpClientMock.Object, fakeLogger, appSettingsMock.Object,
                contextMock.Object, siteSettingsMock.Object, mapper, translationServiceMock.Object, cultureServiceMock.Object));

            //Act
            var result = await searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();
            result.Products.Should().NotBeNull();
            result.Products.First().Price.Should().NotBeNull();
            result.Products.First().Price.ListPrice.Should().Be(NALabel);
            result.Products.First().Price.BasePrice.Should().BeNull();
            result.Products.First().Price.BestPrice.Should().BeNull();
            result.Products.First().Price.BestPriceExpiration.Should().BeNull();
            result.Products.First().Price.BestPriceIncludesWebDiscount.Should().BeNull();
            result.Products.First().Price.PromoAmount.Should().BeNull();
        }



        [Theory]
        [AutoDomainData]
        public async Task FullSearchProduct_VendorShippedFalseWhenIndicatorsNull(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            appResponse.Products[0].Indicators = null;

            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();
            result.Products[0].Stock.VendorShipped.Should().BeFalse();
        }

        [Theory]
        [AutoDomainData]
        public async Task FullSearchProduct_VendorShippedFalseWhenVDINotNull(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            appResponse.Products[0].Indicators = new()
            {
                new Dto.FullSearch.Internal.IndicatorDto
                {
                    Type = DropShip,
                    Value = Y
                },
                new Dto.FullSearch.Internal.IndicatorDto
                {
                    Type = Warehouse,
                    Value = N
                }
            };
            appResponse.Products[0].Stock.VendorDesignated = 44;
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();
            result.Products[0].Stock.VendorShipped.Should().BeFalse();
        }

        [Theory]
        [AutoDomainData]
        public async Task FullSearchProduct_VendorShippedTrue(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            appResponse.Products[0].Indicators = new()
            {
                new Dto.FullSearch.Internal.IndicatorDto
                {
                    Type = DropShip,
                    Value = Y
                },
                new Dto.FullSearch.Internal.IndicatorDto
                {
                    Type = Warehouse,
                    Value = N
                }
            };
            appResponse.Products[0].Stock.VendorDesignated = null;
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();
            result.Products[0].Stock.VendorShipped.Should().BeTrue();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetAdvancedRefinements_MapResponseProperly(SearchRequestDto request)
        {
            //arrange
            _translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), null)).Returns((Dictionary<string, string> dict, string key, string fallback) => key);
            _translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), "InStock", null)).Returns("Stock Level");

            var appResponse = new SearchResponseDto
            {
                RefinementGroups = new List<Dto.FullSearch.Internal.RefinementGroupResponseDto>
                {
                    new Dto.FullSearch.Internal.RefinementGroupResponseDto
                    {
                        Group="InStock",
                        Refinements = new List<Dto.FullSearch.Internal.RefinementDto>
                        {
                            new Dto.FullSearch.Internal.RefinementDto
                            {
                                Id="InStock",
                                Name="InStock",
                                Range = new Dto.FullSearch.Internal.RangeDto
                                {
                                    Min=0,
                                    Max=100
                                },
                                Options = new List<Dto.FullSearch.Internal.RefinementOptionDto>
                                {
                                 new Dto.FullSearch.Internal.RefinementOptionDto
                                 {
                                     Id=Y,
                                     Text="yes",
                                     Count=1
                                 }
                                }
                            }
                        }
                    },
                    new Dto.FullSearch.Internal.RefinementGroupResponseDto
                    {
                        Group="Categories",
                        Refinements = new List<Dto.FullSearch.Internal.RefinementDto>
                        {
                            new Dto.FullSearch.Internal.RefinementDto
                            {
                                Id="Categories",
                                Name="Categories",
                                Options = new List<Dto.FullSearch.Internal.RefinementOptionDto>
                                {
                                 new Dto.FullSearch.Internal.RefinementOptionDto
                                 {
                                     Id=Y,
                                     Text="yes",
                                     Count=1
                                 }
                                }
                            }
                        }
                    },
                    new Dto.FullSearch.Internal.RefinementGroupResponseDto
                    {
                        Group="CNETAttributes",
                        Refinements = new List<Dto.FullSearch.Internal.RefinementDto>
                        {
                            new Dto.FullSearch.Internal.RefinementDto
                            {
                                Id="a1",
                                Name="Group / Subgroup1",
                                Options= new List<Dto.FullSearch.Internal.RefinementOptionDto>
                                {
                                    new Dto.FullSearch.Internal.RefinementOptionDto
                                    {
                                        Id="a1o1",
                                        Count=1,
                                        Text="a1o1text"
                                    }
                                },
                                 Range = new Dto.FullSearch.Internal.RangeDto
                                 {
                                     Max=5,
                                     Min=1,
                                 }
                            },
                            new Dto.FullSearch.Internal.RefinementDto
                            {
                                Id="a2",
                                Name="Group / Subgroup2",
                                Options= new List<Dto.FullSearch.Internal.RefinementOptionDto>
                                {
                                    new Dto.FullSearch.Internal.RefinementOptionDto
                                    {
                                        Id="a2o1",
                                        Count=1,
                                        Text="a2o1text"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            var expectedReponse = new List<RefinementGroupResponseModel>()
            {
                new RefinementGroupResponseModel
                {
                    Group="General",
                    Refinements= new List<RefinementModel>
                    {
                        new RefinementModel
                        {
                            Id="InStock",
                            Name="Stock Level",
                            OriginalGroupName="InStock",
                            Range = new RangeModel
                            {
                                Min=0,
                                Max=100
                            },
                            Options = new List<RefinementOptionModel>
                            {
                                new RefinementOptionModel
                                {
                                    Id=Y,
                                    Text="yes",
                                    Count=1
                                }
                            }
                        },
                        new RefinementModel
                        {
                            Id="Categories",
                            Name="Categories",
                            OriginalGroupName="Categories",
                            Options = new List<RefinementOptionModel>
                            {
                                new RefinementOptionModel
                                {
                                    Id=Y,
                                    Text="yes",
                                    Count=1
                                }
                            }
                        }
                    }
                },
                new RefinementGroupResponseModel
                {
                    Group="Group",
                    Refinements = new List<RefinementModel>
                    {
                        new RefinementModel
                        {
                            Name="Subgroup1",
                            Id="a1",
                            OriginalGroupName="CNETAttributes",
                            Options= new List<RefinementOptionModel>
                            {
                                new RefinementOptionModel
                                {
                                    Id="a1o1",
                                    Count=1,
                                    Text="a1o1text"
                                }
                            },
                            Range = new RangeModel
                            {
                                Min=1,
                                Max=5
                            }
                        },
                        new RefinementModel
                        {
                            Name="Subgroup2",
                            Id="a2",
                            OriginalGroupName="CNETAttributes",
                            Options= new List<RefinementOptionModel>
                            {
                                new RefinementOptionModel
                                {
                                    Id="a2o1",
                                    Count=1,
                                    Text="a2o1text"
                                }
                            }
                        }
                    }
                }
            };

            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ReturnsAsync(appResponse)
                .Verifiable()
                ;

            //act
            var actual = await _searchService.GetAdvancedRefinements(request).ConfigureAwait(false);

            //assert
            actual.Should().BeEquivalentTo(expectedReponse);
            _middleTierHttpClient.VerifyAll();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetAdvancedRefinements_ReturnNull(SearchRequestDto request)
        {
            //arrange

            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ReturnsAsync((SearchResponseDto)null)
                .Verifiable()
                ;

            //act
            var actual = await _searchService.GetAdvancedRefinements(request).ConfigureAwait(false);

            //assert
            actual.Should().BeEmpty();
            _middleTierHttpClient.VerifyAll();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetFullSearchProduct_CheckIndicators(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            appResponse.Products[0].Indicators = new()
            {
                new Dto.FullSearch.Internal.IndicatorDto
                {
                    Type = FreeShipping,
                    Value = "test"
                }
            };
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));
            _translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns((Dictionary<string, string> dict, string key, string fallback) => { return $"{key}_Translated"; });

            //Act
            var result = await _searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();
            result.Products[0].Indicators.Should().NotBeNullOrEmpty();
            result.Products[0].Indicators[FreeShipping].Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductReturnsCorrectResult(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            appResponse.RefinementGroups.First().Group = "TopRefinements";
            appResponse.RefinementGroups.First().Refinements.First().OriginalGroupName = "InStock";
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetFullSearchProductData(request, true);

            //Assert
            result.Should().NotBeNull();

            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductSearchPreviewDataReturnsCorrectResult(SearchRequestDto request, SearchResponseDto appResponse)
        {
            //Arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetProductSearchPreviewData(request);

            //Assert
            result.Should().NotBeNull();

            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetProductSearchPreviewDataThrowsExceptionOtherThanRemoteServerHttpException(SearchRequestDto request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ThrowsAsync(new Exception("test"));

            //act
            Func<Task> act = async () => await _searchService.GetProductSearchPreviewData(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetProductSearchPreviewDataThrowsOtherThanNotFound(SearchRequestDto request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.InternalServerError, details: null));

            //act
            Func<Task> act = async () => await _searchService.GetProductSearchPreviewData(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductSearchPreviewDataThrowsWhenNotFoundReturned(SearchRequestDto request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.NotFound, details: null));

            //act
            var result = await _searchService.GetProductSearchPreviewData(request);

            //assert
            result.Should().BeEmpty();
            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetProductThrowsExceptionOtherThanRemoteServerHttpException(SearchRequestDto request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ThrowsAsync(new Exception("test"));

            //act
            Func<Task> act = async () => await _searchService.GetFullSearchProductData(request, true);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetProductThrowsOtherThanNotFound(SearchRequestDto request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.InternalServerError, details: null));

            //act
            Func<Task> act = async () => await _searchService.GetFullSearchProductData(request, true);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductThrowsWhenNotFoundReturned(SearchRequestDto request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.NotFound, details: null));

            //act
            var result = await _searchService.GetFullSearchProductData(request, true);

            //assert
            result.Should().BeNull();
            _middleTierHttpClient.Verify(x => x.PostAsync<SearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>(), null, null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadReturnsCorrectResult(TypeAhead.Request request, List<TypeAheadModel> appResponse)
        {
            //Arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetTypeAhead(request);

            //Assert
            result.Should().NotBeNull();

            foreach (var item in appResponse)
            {
                result.Find(x => x.Id == item.Id
                    && x.Name == item.Name
                    && x.Type == item.Type
                    && x.CategoryName == item.CategoryName
                    && x.Description == item.Description).Should().NotBeNull();
            }

            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void TypeAheadThrowsExceptionOtherThanRemoteServerHttpException(TypeAhead.Request request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .ThrowsAsync(new Exception("test"));

            //act
            Func<Task> act = async () => await _searchService.GetTypeAhead(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void TypeAheadThrowsOtherThanNotFound(TypeAhead.Request request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.InternalServerError, details: null));

            //act
            Func<Task> act = async () => await _searchService.GetTypeAhead(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadThrowsWhenNotFoundReturned(TypeAhead.Request request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.NotFound, details: null));

            //act
            var result = await _searchService.GetTypeAhead(request);

            //assert
            result.Should().BeNull();
            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        [Theory]
        [AutoDomainData(nameof(AddFreeShuppingIndicator_Test_Data))]
        public void AddFreeShuppingIndicator_Test(ElasticItemDto productDto, ElasticItemModel productModel, string expectedValue)
        {
            // Arrange
            MethodInfo sut = typeof(SearchService).GetMethod("AddFreeShuppingIndicator", BindingFlags.Instance | BindingFlags.NonPublic);
            _translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns((Dictionary<string, string> dict, string key, string fallback) => { return $"{key}_Translated"; })
                .Verifiable();
            //Act

            sut.Invoke(_searchService, new object[] { productDto, productModel });
            //Assert
            _translationServiceMock.VerifyAll();
            productModel.Indicators.Should().ContainKey("FreeShipping");
            productModel.Indicators["FreeShipping"].Should().Be(expectedValue);
        }

        public static IEnumerable<object> AddFreeShuppingIndicator_Test_Data()
        {
            return new[]
            {
                new object[]
                {
                    new ElasticItemDto
                    {
                    },
                    new ElasticItemModel
                    {
                        Indicators = new()
                    },
                    "FreeShipping.N_Translated"
                },
                new object[]
                {
                    new ElasticItemDto
                    {
                        Indicators = new List<IndicatorDto>
                        {
                            new IndicatorDto
                            {
                                Type="FreeShipping",
                                Value="Y"
                            }
                        }
                    },
                    new ElasticItemModel
                    {
                        Indicators = new()
                    },
                    "FreeShipping.Y_Translated"
                }
            };
        }
    }
}