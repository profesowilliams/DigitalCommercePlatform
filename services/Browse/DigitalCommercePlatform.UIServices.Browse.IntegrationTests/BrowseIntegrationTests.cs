//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIService.Browse;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.Browse.IntegrationTests
{
    public class UISetup : Setup
    {
        public override void AddClients(ITestHttpClientFactory factory, string serviceName)
               => factory
                   .AddClient<ISimpleHttpClient>()
                       .MatchContains($"AppSetting/{serviceName}")
                    .Returns(Defaults.GetAppSettings()
                                .Extend("Core.Price.Url", "https://fakeurl.com/v1")
                                .Extend("Core.Security.Url", string.Empty)
                                .Extend("UI.Security.CorsAllowedOrigin", "true")
                                .Extend("UI.Security.CorsAllowedHeaders", "true")
                                .Extend("UI.Security.CorsAllowedMethods", "true")
                                .Extend("MaxPageSize", "100"))
                       .MatchContains($"/Data/{serviceName}")
                       .Returns<Dictionary<string, string>>()
                       .MatchContains($"SiteSetting/{serviceName}")
                       .Returns(Defaults.GetSiteSettings())
                   .Build()
                   .AddClient<IMiddleTierHttpClient>()
                   .Build();

        public override void PostStartupConfigureServices(IServiceCollection serviceDescriptors)
            => serviceDescriptors.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
    }

    public class UIFixture : TestServerFixture<Startup, UISetup>
    { }

    public class BrowseUIIntegrationTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture fixture;

        public BrowseUIIntegrationTests(UIFixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }

        [Theory]
        [InlineData("v1/header?catalogueCriteria=ALT&isDefault=true")]
        public async Task GetHeader(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("app-customer")
                .Returns(() => new List<CustomerModel>() { new CustomerModel() { Source = new DigitalFoundation.Common.MongoDb.Models.Source() } })
                .MatchContains("app-catalog")
                .Returns(() => new GetHeaderHandler.Response() { CatalogHierarchies = new List<CatalogHierarchyModel>() { new CatalogHierarchyModel() } });
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetHeaderHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/cart")]
        public async Task GetCartDetails(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains(input)
                .Returns<ResponseBase<GetCartHandler.Response>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetCartHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/catalogue?id=14")]
        public async Task GetCatalog(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("id=14")
                .Returns(() => new GetCatalogHandler.Response() { });
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetCatalogHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/customer")]
        public async Task GetCustomer(string input)
        {
            fixture.CreateChildScope().OverrideClient<object>()
                .MatchContains(input)
                .Returns(() => new List<CustomerModel>() { new CustomerModel() });
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetCustomerHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/Product/Details?id=13")]
        public async Task GetProductWithDetails(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("details=true")
                .Returns<ResponseBase<GetProductDetailsHandler.Response>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetProductDetailsHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProductWithDetails(FindProductModel model)
        {
            model.Details = true;
            var input = "v1/product/summary".BuildQuery(model);
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("find")
                .Returns<IEnumerable<ProductModel>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<FindProductHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProduct(FindProductModel model)
        {
            model.Details = false;
            var input = "v1/product/summary".BuildQuery(model);
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("find")
                .Returns<SummaryModel>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<FindSummaryHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineDomainData("/v1/getProductCatalog?IsSourceDF=true&id=ALT&level=3&shortenSubcategories=true&cultureName=&corporateCode=0100")]
        public async Task GetProductCatalogService(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("IsSourceDF=false")
                .Returns<ResponseBase<GetProductCatalogHandler.Response>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetProductCatalogHandler.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }
    }
}