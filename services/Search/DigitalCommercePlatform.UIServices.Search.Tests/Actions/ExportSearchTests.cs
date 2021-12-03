//2021 (c) Tech Data Corporation -. All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions
{
    public class ExportSearchTests
    {
        private readonly Mock<IMiddleTierHttpClient> _httpClientMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IAppSettings> _appsettingsMock;
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly FakeLogger<ExportSearch.Handler> _logger;
        private readonly ExportSearch.Handler _sut;

        public ExportSearchTests()
        {
            _httpClientMock = new Mock<IMiddleTierHttpClient>();
            _mapperMock = new Mock<IMapper>();
            _appsettingsMock = new Mock<IAppSettings>();
            _appsettingsMock.Setup(x => x.GetSetting("Search.App.Url")).Returns("http://appsearch");
            _siteSettingsMock = new Mock<ISiteSettings>();
            _siteSettingsMock.Setup(x => x.GetSetting<int>("Search.UI.Export.MaxProducts")).Returns(100);
            _logger = new FakeLogger<ExportSearch.Handler>();

            _sut = new ExportSearch.Handler(_httpClientMock.Object, _mapperMock.Object, _appsettingsMock.Object, _logger, _siteSettingsMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_CallAppSearch(ExportSearch.Request request, SearchRequestDto searchRequestDto, SearchResponseDto searchResponseDto)
        {
            //arrange
            searchRequestDto.PageSize = 100;
            _mapperMock
                .Setup(x => x.Map<SearchRequestDto>(request.Data))
                .Returns(searchRequestDto)
                .Verifiable();

            _httpClientMock
                .Setup(x => x.PostAsync<SearchResponseDto>("http://appsearch/Product", null, searchRequestDto, null, null))
                .ReturnsAsync(searchResponseDto)
                .Verifiable();

            //act
            await _sut.Handle(request, default);

            //assert
            _mapperMock.Verify();
            _httpClientMock.Verify();
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_ReturnNull_WhenNotFoundFromAppSearch(ExportSearch.Request request, SearchRequestDto searchRequestDto)
        {
            //arrange
            searchRequestDto.PageSize = 100;
            _mapperMock
                .Setup(x => x.Map<SearchRequestDto>(request.Data))
                .Returns(searchRequestDto);

            _httpClientMock
                .Setup(x => x.PostAsync<SearchResponseDto>("http://appsearch/Product", null, searchRequestDto, null, null))
                .ThrowsAsync(new RemoteServerHttpException("not found exception", System.Net.HttpStatusCode.NotFound, details: null))
                ;

            //act
            var expected = await _sut.Handle(request, default);

            //assert
            expected.Should().BeNull();
            _logger.GetMessages().Should().BeEmpty();
        }

        [Theory]
        [AutoDomainData]
        public void Handle_ThrowAndLogExcpetion_WhenAnotherCodeExcpetion(ExportSearch.Request request, SearchRequestDto searchRequestDto)
        {
            //arrange
            searchRequestDto.PageSize = 100;
            _mapperMock
                .Setup(x => x.Map<SearchRequestDto>(request.Data))
                .Returns(searchRequestDto);

            _httpClientMock
                .Setup(x => x.PostAsync<SearchResponseDto>("http://appsearch/Product", null, searchRequestDto, null, null))
                .ThrowsAsync(new RemoteServerHttpException("another excpetion", System.Net.HttpStatusCode.InternalServerError, details: null))
                ;

            //act
            Func<Task> act = async () => await _sut.Handle(request, default);

            //assert
            act.Should().ThrowAsync<RemoteServerHttpException>();
            _logger.GetMessages(Microsoft.Extensions.Logging.LogLevel.Error).Should().ContainMatch("Exception at getting ExportSearch*");
        }

        [Theory]
        [AutoDomainData]
        public void Handle_ThrowAndLogExcpetion_WhenAnotherExcpetion(ExportSearch.Request request, SearchRequestDto searchRequestDto)
        {
            //arrange
            searchRequestDto.PageSize = 100;
            _mapperMock
                .Setup(x => x.Map<SearchRequestDto>(request.Data))
                .Returns(searchRequestDto);

            _httpClientMock
                .Setup(x => x.PostAsync<SearchResponseDto>("http://appsearch/Product", null, searchRequestDto, null, null))
                .ThrowsAsync(new TestException())
                ;

            //act
            Func<Task> act = async () => await _sut.Handle(request, default);

            //assert
            act.Should().ThrowAsync<TestException>();
            _logger.GetMessages(Microsoft.Extensions.Logging.LogLevel.Error).Should().ContainMatch("Exception at getting ExportSearch*");
        }

        public class TestException : Exception
        { };

        [Theory]
        [AutoDomainData(nameof(Handle_ProperlyMapData_Data))]
        public async Task Handle_ProperlyMapData(SearchResponseDto searchResponseDto, IEnumerable<ExportResponseModel> expectedResults, ExportSearch.Request request, SearchRequestDto searchRequestDto)
        {
            //arrange
            searchRequestDto.PageSize = 100;
            _mapperMock
                .Setup(x => x.Map<SearchRequestDto>(request.Data))
                .Returns(searchRequestDto);

            _httpClientMock
                .Setup(x => x.PostAsync<SearchResponseDto>("http://appsearch/Product", null, searchRequestDto, null, null))
                .ReturnsAsync(searchResponseDto);

            //act
            var actual = await _sut.Handle(request, default);

            //assert
            actual.Should().BeEquivalentTo(expectedResults);
        }

        public static IEnumerable<object> Handle_ProperlyMapData_Data()
        {
            return new[] {
                new object[]
                {
                    new SearchResponseDto
                    {
                        TotalResults=1,
                        Products = new List<Dto.FullSearch.Internal.ElasticItemDto>
                        {
                            new Dto.FullSearch.Internal.ElasticItemDto
                            {
                                CNETManufacturer="CnetManufacturer",
                                ManufacturerPartNumber="mfr#",
                                GlobalManufacturer="globalManufacturer",
                                Id="p1",
                                UpcEan="upc",
                                Stock = new Dto.FullSearch.Internal.SalesOrgStocksDto
                                {
                                    Total=5
                                },
                                Indicators = new List<Dto.FullSearch.Internal.IndicatorDto>
                                {
                                    new Dto.FullSearch.Internal.IndicatorDto
                                    {
                                        Type="DisplayStatus",
                                        Value="Active"
                                    }
                                },
                                LongDescription = "longDescription",
                                ShortDescription="shortDescriptin",
                                Name="name",
                                Price = new Dto.FullSearch.Internal.PriceDto
                                {
                                    ListPrice=20,
                                    BestPrice=15,
                                    BestPriceExpiration=new DateTime(2100,1,1),
                                    BasePrice=19
                                }
                            }
                        }
                    },
                    new List<ExportResponseModel>
                    {
                        new ExportResponseModel
                        {
                            ManufacturerName="CnetManufacturer",
                            ManufacturerPartNumber="mfr#",
                            Id="p1",
                            UpcNumber="upc",
                            TotalStock=5,
                            ProductStatus="Active",
                            Description="longDescription",
                            ListPrice=20,
                            BestPrice=15,
                            BestPriceExpiration=new DateTime(2100,1,1),
                            PromoIndicator="YES",
                            MaximumResults=true
                        }
                    }
                },
                new object[]
                {
                    new SearchResponseDto
                    {
                        TotalResults=1000,
                        Products = new List<Dto.FullSearch.Internal.ElasticItemDto>
                        {
                            new Dto.FullSearch.Internal.ElasticItemDto
                            {
                                ManufacturerPartNumber="mfr#",
                                GlobalManufacturer="globalManufacturer",
                                Id="p1",
                                UpcEan="upc",
                                Indicators = new List<Dto.FullSearch.Internal.IndicatorDto>
                                {
                                    new Dto.FullSearch.Internal.IndicatorDto
                                    {
                                        Type="AnotherIndicator",
                                        Value="Active"
                                    }
                                },
                                ShortDescription="shortDescriptin",
                                Name="name"
                            }
                        }
                    },
                    new List<ExportResponseModel>
                    {
                        new ExportResponseModel
                        {
                            ManufacturerName="globalManufacturer",
                            ManufacturerPartNumber="mfr#",
                            Id="p1",
                            UpcNumber="upc",
                            TotalStock=0,
                            ProductStatus=null,
                            Description="shortDescriptin",
                            ListPrice=null,
                            BestPrice=null,
                            BestPriceExpiration=null,
                            PromoIndicator="NO",
                            MaximumResults=false
                        }
                    }
                },
                new object[]
                {
                    new SearchResponseDto
                    {
                        TotalResults=1000,
                        Products = new List<Dto.FullSearch.Internal.ElasticItemDto>
                        {
                            new Dto.FullSearch.Internal.ElasticItemDto
                            {
                                ManufacturerPartNumber="mfr#",
                                GlobalManufacturer="globalManufacturer",
                                Id="p1",
                                UpcEan="upc",
                                Name="name",
                                Price = new Dto.FullSearch.Internal.PriceDto
                                {
                                    BestPrice=null,
                                    BasePrice=19
                                }
                            }
                        }
                    },
                    new List<ExportResponseModel>
                    {
                        new ExportResponseModel
                        {
                            ManufacturerName="globalManufacturer",
                            ManufacturerPartNumber="mfr#",
                            Id="p1",
                            UpcNumber="upc",
                            TotalStock=0,
                            ProductStatus=null,
                            Description="name",
                            ListPrice=null,
                            BestPrice=null,
                            BestPriceExpiration=null,
                            PromoIndicator="NO",
                            MaximumResults=false
                        }
                    }
                },
                new object[]
                {
                    new SearchResponseDto
                    {
                        TotalResults=1000,
                        Products = new List<Dto.FullSearch.Internal.ElasticItemDto>
                        {
                            new Dto.FullSearch.Internal.ElasticItemDto
                            {
                                ManufacturerPartNumber="mfr#",
                                GlobalManufacturer="globalManufacturer",
                                Id="p1",
                                UpcEan="upc",
                                ShortDescription="shortDescriptin",
                                Name="name",
                                Price = new Dto.FullSearch.Internal.PriceDto
                                {
                                    BestPrice=15,
                                    BasePrice=null
                                }
                            }
                        }
                    },
                    new List<ExportResponseModel>
                    {
                        new ExportResponseModel
                        {
                            ManufacturerName="globalManufacturer",
                            ManufacturerPartNumber="mfr#",
                            Id="p1",
                            UpcNumber="upc",
                            TotalStock=0,
                            ProductStatus=null,
                            Description="shortDescriptin",
                            ListPrice=null,
                            BestPrice=15,
                            BestPriceExpiration=null,
                            PromoIndicator="NO",
                            MaximumResults=false
                        }
                    }
                },
                new object[]
                {
                    new SearchResponseDto
                    {
                        TotalResults=1000,
                        Products = new List<Dto.FullSearch.Internal.ElasticItemDto>
                        {
                            new Dto.FullSearch.Internal.ElasticItemDto
                            {
                                ManufacturerPartNumber="mfr#",
                                GlobalManufacturer="globalManufacturer",
                                Id="p1",
                                UpcEan="upc",
                                ShortDescription="shortDescriptin",
                                Name="name",
                                Price = new Dto.FullSearch.Internal.PriceDto
                                {
                                    BestPrice=15,
                                    BasePrice=15
                                }
                            }
                        }
                    },
                    new List<ExportResponseModel>
                    {
                        new ExportResponseModel
                        {
                            ManufacturerName="globalManufacturer",
                            ManufacturerPartNumber="mfr#",
                            Id="p1",
                            UpcNumber="upc",
                            TotalStock=0,
                            ProductStatus=null,
                            Description="shortDescriptin",
                            ListPrice=null,
                            BestPrice=15,
                            BestPriceExpiration=null,
                            PromoIndicator="NO",
                            MaximumResults=false
                        }
                    }
                }
            };
        }

        [Theory]
        [AutoDomainData]
        public void Validator_ReturnValid(ExportSearch.Request request)
        {
            //arrange
            var sut = new ExportSearch.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [AutoDomainData(nameof(Validator_ReturnInValid_Data))]
        public void Validator_ReturnInValid(ExportSearch.Request request, string propertyName)
        {
            //arrange
            var sut = new ExportSearch.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldHaveValidationErrorFor(propertyName);
        }

        public static IEnumerable<object> Validator_ReturnInValid_Data()
        {
            return new[]
            {
                new object[]
                {
                    new ExportSearch.Request(),
                    "Data"
                },
                new object[]
                {
                    new ExportSearch.Request{ Data = new ExportRequestModel{ SearchString=""} },
                    "Data.SearchString"
                },
                new object[]
                {
                    new ExportSearch.Request{ Data = new ExportRequestModel{ SearchString=null} },
                    "Data.SearchString"
                }
            };
        }
    }
}