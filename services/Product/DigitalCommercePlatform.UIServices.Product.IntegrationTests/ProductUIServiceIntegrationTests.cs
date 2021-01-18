//using DigitalCommercePlatform.UIService.Product.Actions.Product;
//using DigitalCommercePlatform.UIService.Product.Dto.Product;
////using DigitalCommercePlatform.UIService.Product.Dto.Stock;
//using DigitalCommercePlatform.UIService.Product.Dto.Summary;
//using DigitalCommercePlatform.UIService.Product.Models.Product;
//using DigitalCommercePlatform.UIService.Product.Models.Summary;
//using DigitalFoundation.Common.Client;
//using DigitalFoundation.Common.IntegrationTestUtilities;
//using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
//using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
//using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
//using DigitalFoundation.Core.Models.DTO.Common;
//using FluentAssertions;
//using Microsoft.AspNetCore.Authorization.Policy;
//using Microsoft.Extensions.DependencyInjection;
//using System;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Threading.Tasks;
//using Xunit;
//using Xunit.Abstractions;

//namespace DigitalCommercePlatform.UIService.Product.IntegrationTests
//{
//    public class Fixture : TestServerFixture<Startup>
//    {
//        public override Action<ITestHttpClientFactory> AddClients =>
//            factory => factory
//                        .AddClient<ISimpleHttpClient>()
//                            .MatchContains($"AppSetting/{ServiceName}")
//                            .Returns(Defaults.GetAppSettings()
//                                .Extend("Core.Security.Url", "fakeUrl")
//                                .Extend("Core.Product.Url", "http://product")
//                                .Extend("Core.Stock.Url", "http://stock"))
//                            .MatchContains($"/Data/{ServiceName}")
//                            .Returns<Dictionary<string, string>>()
//                            .MatchContains($"SiteSetting/{ServiceName}")
//                            .Returns(Defaults.GetSiteSettings())
//                        .Build()
//                        .AddClient<IMiddleTierHttpClient>().Build();

//        public override Action<IServiceCollection> PostStartupConfigureServices =>
//            services =>
//            {
//                services.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
//            };
//    }

//    public class ProductAppServiceIntegrationTests : IClassFixture<Fixture>
//    {
//        private readonly Fixture fixture;

//        public ProductAppServiceIntegrationTests(Fixture fixture, ITestOutputHelper output)
//        {
//            this.fixture = fixture;
//            TestOutput.Output = output;
//        }

//        [Theory]
//        [InlineData("/v1/?id=1")]
//        public async Task App_Get_ReturnsData(string url)
//        {
//            using var scope = fixture.CreateChildScope();
//            scope.OverrideClient<IMiddleTierHttpClient>()
//                .ForHttpMethod(HttpMethod.Get)
//                .Match(x => x.RequestUri.ToString() == "http://product/?Id=1&details=True")
//                .Returns<IEnumerable<ProductDto>>(r =>
//                {
//                    return new List<ProductDto> { new ProductDto { Source = new Dto.Product.Internal.SourceDto { Id = "1" } } };
//                })
//                .ForHttpMethod(HttpMethod.Get)
//                .Match(x => x.RequestUri.ToString() == "http://stock/?id=1&details=True")
//                //.Returns<IEnumerable<StockDto>>(r =>
//                //{
//                //    return new List<StockDto> { new StockDto { Source = new Dto.Stock.Internal.SourceDto { Id = "1" } } };
//                //});

//            var client = fixture.CreateClient().SetDefaultHeaders();
//            //TODO fix
//            _ = await client.RunTest(c => c.GetAsync(url), System.Net.HttpStatusCode.OK);
//        }

//        [Theory]
//        [InlineData("/v1?id=1,2&details=true")]
//        public async Task App_GetMultiple_ReturnsData(string url)
//        {
//            //Arrange
//            var coreObject = new List<ProductDto> {
//                new ProductDto { Source = new Dto.Product.Internal.SourceDto { Id = "1" } },
//                new ProductDto { Source = new Dto.Product.Internal.SourceDto { Id = "2" } } };

//            //var coreStock = new List<StockDto> {
//            //  new StockDto() { Source = new Dto.Stock.Internal.SourceDto { Id = "1" } },
//            //  new StockDto() { Source = new Dto.Stock.Internal.SourceDto { Id = "2" } }
//            //};

//            using var scope = fixture.CreateChildScope();
//            scope.OverrideClient<IMiddleTierHttpClient>()
//                .ForHttpMethod(HttpMethod.Get)
//                .MatchContains("/?Id=1&Id=2&details=True")
//                .Returns<IEnumerable<ProductDto>>(r =>
//                {
//                    return coreObject;
//                })
//                .ForHttpMethod(HttpMethod.Get)
//                .MatchContains("/?id=1&details=True")
//                //.Returns<IEnumerable<StockDto>>(r =>
//                //{
//                //    return coreStock;
//                //});

//            var client = fixture.CreateClient().SetDefaultHeaders();

//            //Act
//            var response = await client.RunTest<Response<IEnumerable<ProductModel>>>(c => c.GetAsync(url), System.Net.HttpStatusCode.OK);

//            //Assert
//            response.ReturnObject.Should().HaveCount(coreObject.Count);
//        }

//        [Theory]
//        [InlineData("/v1?id=1,2&details=false")]
//        public async Task App_GetSummaryMultiple_ReturnsData(string url)
//        {
//            //Arrange
//            var coreObject = new List<SummaryDto> {
//                new SummaryDto { Source = new Dto.Summary.Internal.SourceDto { Id = "1" } },
//                new SummaryDto { Source = new Dto.Summary.Internal.SourceDto { Id = "2" } } };

//            var stockObject = new List<StockSummaryDto> {
//              new StockSummaryDto() { Source = new Dto.Stock.Internal.SourceDto { Id = "1" } },
//              new StockSummaryDto() { Source = new Dto.Stock.Internal.SourceDto { Id = "2" } }
//            };

//            using var scope = fixture.CreateChildScope();
//            scope.OverrideClient<IMiddleTierHttpClient>()
//                .ForHttpMethod(HttpMethod.Get)
//                .MatchContains("/?Id=1&Id=2&details=False")
//                .Returns<IEnumerable<SummaryDto>>(r =>
//                {
//                    return coreObject;
//                })
//                .ForHttpMethod(HttpMethod.Get)
//                .MatchContains("/?details=False")
//                .Returns<IEnumerable<StockSummaryDto>>(r =>
//                {
//                    return stockObject;
//                });

//            var client = fixture.CreateClient().SetDefaultHeaders();

//            //Act
//            var response = await client.RunTest<Response<IEnumerable<SummaryModel>>>(c => c.GetAsync(url), System.Net.HttpStatusCode.OK);

//            //Assert
//            response.ReturnObject.Should().HaveCount(coreObject.Count);
//        }

//        [Theory]
//        [InlineData("/v1/Find?Page=1&PageSize=2&MaterialNumber=1&details=true")]
//        public async Task App_FindWithDetails_ReturnsData(string url)
//        {
//            using var scope = fixture.CreateChildScope();
//            scope.OverrideClient<IMiddleTierHttpClient>()
//                .ForHttpMethod(HttpMethod.Get)
//                .Match(x => x.RequestUri.ToString().StartsWith("http://product/Find", StringComparison.InvariantCultureIgnoreCase))
//                .Returns<IEnumerable<ProductDto>>(r =>
//                {
//                })
//                .ForHttpMethod(HttpMethod.Get)
//                .Match(x => x.RequestUri.ToString().StartsWith("http://stock", StringComparison.InvariantCultureIgnoreCase))
//                .Returns<IEnumerable<StockDto>>(r =>
//                {
//                    return new List<StockDto> { new StockDto { Source = new Dto.Stock.Internal.SourceDto { Id = "1" } } };
//                });

//            var client = fixture.CreateClient().SetDefaultHeaders();
//            var response = await client.RunTest<FindProduct.Response>(c => c.GetAsync(url));
//            response.Errors.Should().BeNullOrEmpty();
//            response.ReturnObject.Should().BeAssignableTo<IEnumerable<ProductModel>>();
//        }

//        [Theory]
//        [InlineData("/v1/Find?Page=1&PageSize=2&MaterialNumber=1&details=true")]
//        public async Task App_FindWithoutDetails_ReturnsData(string url)
//        {
//            using var scope = fixture.CreateChildScope();
//            scope.OverrideClient<IMiddleTierHttpClient>()
//                .ForHttpMethod(HttpMethod.Get)
//                .Match(x => x.RequestUri.ToString().StartsWith("http://product/Find", StringComparison.InvariantCultureIgnoreCase))
//                .Returns<IEnumerable<SummaryDto>>(r =>
//                {
//                })
//                .ForHttpMethod(HttpMethod.Get)
//                .Match(x => x.RequestUri.ToString().StartsWith("http://stock", StringComparison.InvariantCultureIgnoreCase))
//                .Returns<IEnumerable<StockDto>>(r =>
//                {
//                    return new List<StockDto> { new StockDto { Source = new Dto.Stock.Internal.SourceDto { Id = "1" } } };
//                });

//            var client = fixture.CreateClient().SetDefaultHeaders();
//            var response = await client.RunTest<FindProduct.Response>(c => c.GetAsync(url));
//            response.Errors.Should().BeNullOrEmpty();
//            response.ReturnObject.Should().BeAssignableTo<IEnumerable<SummaryModel>>();
//        }
//    }
//}