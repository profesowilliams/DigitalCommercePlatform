using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Models.Product;
using DigitalCommercePlatform.UIService.Product.Models.Product.Internal;
using DigitalCommercePlatform.UIService.Product.Models.Summary;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using DigitalFoundation.Core.Models.DTO.Common;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
//using static DigitalCommercePlatform.UIService.Product.Actions.Product.FindProduct1;
//using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductDetailMultiple;
//using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductSummaryMultiple;

namespace DigitalCommercePlatform.UIService.Product.IntegrationTests
{
    public class UISetup : Setup
    {
        public override void AddClients(ITestHttpClientFactory factory, string serviceName)
            => factory
                .AddClient<ISimpleHttpClient>(name: "").Build()
                .AddClient<ISimpleHttpClient>()
                    .MatchContains($"AppSetting/{serviceName}")
                    .Returns(Defaults.GetAppSettings()
                        .Extend("Core.Security.Url", "fakeUrl")
                        .Extend("Core.Product.Url", "http://product")
                        .Extend("Core.Stock.Url", "http://stock"))
                    .MatchContains($"/Data/{serviceName}")
                    .Returns(new Dictionary<string, string>() { { string.Empty, string.Empty } })
                    .MatchContains($"SiteSetting/{serviceName}")
                    .Returns(Defaults.GetSiteSettings())
                .Build()
                .AddClient<IMiddleTierHttpClient>().Build();

        public override void PostStartupConfigureServices(IServiceCollection serviceDescriptors)
            => serviceDescriptors.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
    }

    public class Fixture : TestServerFixture<Startup, UISetup>
    {
    }

    public class ProductAppServiceIntegrationTests : IClassFixture<Fixture>
    {
        private readonly Fixture fixture;

        public ProductAppServiceIntegrationTests(Fixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }

        [Theory]
        [InlineData("v1/?id=1")]
        public async Task App_Get_ReturnsData(string input)
        {
            // Arrange
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
                .ForHttpMethod(HttpMethod.Get)
                .MatchContains("/?Id=1&Details=True")
                .Returns<GetProductDetailMultipleResponse>(r =>
                {
                    return new GetProductDetailMultipleResponse(new List<ProductModel> { new ProductModel { Source = new SourceModel { Id = "1" } } });
                });

            var client = fixture.CreateClient().SetDefaultHeaders();
            var url = new Uri(client.BaseAddress + input);

            // Act
            var response = await client.RunTest(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [InlineData("v1?id=1,2&details=true")]
        public async Task App_GetMultiple_ReturnsData(string input)
        {
            // Arrange
            var coreObject = new List<ProductModel> {
                new ProductModel { Source = new SourceModel { Id = "1" } },
                new ProductModel { Source = new SourceModel { Id = "2" } }
            };

            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
                .ForHttpMethod(HttpMethod.Get)
                .MatchContains("/?Id=1&Id=2&Details=True")
                .Returns<GetProductDetailMultipleResponse>(r =>
                {
                    return new GetProductDetailMultipleResponse(coreObject);
                });

            var client = fixture.CreateClient().SetDefaultHeaders();
            var url = new Uri(client.BaseAddress + input);

            // Act
            var response = await client.RunTest<Response<IEnumerable<ProductModel>>>(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);

            // Assert
            response.ReturnObject.Should().HaveCount(coreObject.Count);
        }

        [Theory]
        [InlineData("v1?id=1,2&details=false")]
        public async Task App_GetSummaryMultiple_ReturnsData(string input)
        {
            // Arrange
            var coreObject = new List<SummaryModel> {
                new SummaryModel { Source = new Models.Summary.Internal.SourceModel { Id = "1" } },
                new SummaryModel { Source = new Models.Summary.Internal.SourceModel { Id = "2" } } };

            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
                .ForHttpMethod(HttpMethod.Get)
                .MatchContains("/?Id=1&Id=2&details=False")
                .Returns<GetProductSummaryMultipleResponse>(r =>
                {
                    return new GetProductSummaryMultipleResponse(coreObject);
                });

            var client = fixture.CreateClient().SetDefaultHeaders();
            var url = new Uri(client.BaseAddress + input);

            // Act
            var response = await client.RunTest<Response<IEnumerable<SummaryModel>>>(c => c.GetAsync(url), System.Net.HttpStatusCode.OK).ConfigureAwait(false);

            // Assert
            response.ReturnObject.Should().HaveCount(coreObject.Count);
        }

        [Theory]
        [InlineData("v1/Find?Page=1&PageSize=2&MaterialNumber=1&details=true")]
        public async Task App_FindWithDetails_ReturnsData(string input)
        {
            // Arrange
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
                .ForHttpMethod(HttpMethod.Get)
                .MatchContains("v1/Find/")
                .Returns<Response>(r =>
                {
                    return new Response(new List<ProductModel> { new ProductModel { Source = new SourceModel { Id = "1" } } });
                });

            var client = fixture.CreateClient().SetDefaultHeaders();
            var url = new Uri(client.BaseAddress + input);

            // Act
            var response = await client.RunTest<Response>(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);

            // Assert
            response.Errors.Should().BeNullOrEmpty();
            response.ReturnObject.Should().BeAssignableTo<IEnumerable<ProductModel>>();
        }

        [Theory]
        [InlineData("v1/Find?Page=1&PageSize=2&MaterialNumber=1&details=false")]
        public async Task App_FindWithoutDetails_ReturnsData(string input)
        {
            // Arrange
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
                .ForHttpMethod(HttpMethod.Get)
                .MatchContains("v1/Find/")
                .Returns<FindSummary.Response>(r =>
                {
                    return new FindSummary.Response(new List<SummaryModel> { new SummaryModel { Source = new Models.Summary.Internal.SourceModel { Id = "1" } } });
                });

            var client = fixture.CreateClient().SetDefaultHeaders();
            var url = new Uri(client.BaseAddress + input);

            // Act
            var response = await client.RunTest<FindSummary.Response>(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);

            // Assert
            response.Errors.Should().BeNullOrEmpty();
            response.ReturnObject.Should().BeAssignableTo<IEnumerable<SummaryModel>>();
        }
    }
}