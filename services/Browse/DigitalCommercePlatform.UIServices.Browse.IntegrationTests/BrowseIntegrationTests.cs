using DigitalCommercePlatform.UIService.Browse;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails.GetCartHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails.GetCatalogHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails.GetCustomerHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails.GetHeaderHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductSummaryHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Browse.IntegrationTests
{
    public class UISetup : Setup
    {
        public override void AddClients([NotNull]ITestHttpClientFactory factory, string serviceName)
           => factory
               .AddClient<ISimpleHttpClient>()
                       .MatchContains($"AppSetting/{serviceName}")
                       .Returns(Defaults.GetAppSettings())
                       .MatchContains($"/Data/{serviceName}")
                       .Returns<Dictionary<string, string>>()
                       .MatchContains($"SiteSetting/{serviceName}")
                       .Returns(Defaults.GetSiteSettings())
                       .Build()
                       .AddClient<IMiddleTierHttpClient>()
                       .Build()
                       .AddClient<HttpClient>(null, "apiServiceClient")
                       .Build();

        public override void PostStartupConfigureServices(IServiceCollection serviceDescriptors)
            => serviceDescriptors.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
    }

    public class UIFixture : TestServerFixture<Startup, UISetup>
    { }

    public class CatalogUIIntegrationTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture fixture;

        public CatalogUIIntegrationTests(UIFixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }

        [Theory]
        [InlineData("v1/header/get?userId=us51&customerId=cust51")]
        public async Task GetHeader(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("app-customer")
                .Returns(() => new List<CustomerModel>() { new CustomerModel() { Source = new DigitalFoundation.Common.MongoDb.Models.Source() } })
                .MatchContains("app-catalog")
                .Returns(() => new GetCatalogResponse() { CatalogHierarchies = new List<CatalogHierarchyModel>() { new CatalogHierarchyModel() } });
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetHeaderResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/cart/get?userId=us51&customerId=cust51")]
        public async Task GetCartDetails(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains(input)
                .Returns<GetCartResponse>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetCartResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/catalogue/get?id=14")]
        public async Task GetCatalog(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("id=14")
                .Returns(() => new GetCatalogResponse() { });
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetCatalogResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/customer/get?id=14")]
        public async Task GetCustomer(string input)
        {
            fixture.CreateChildScope().OverrideClient<object>()
                .MatchContains("id=14")
                .Returns(() => new List<CustomerModel>() { new CustomerModel() });
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetCustomerResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/Product/get?id=13&details=true")]
        public async Task GetProductWithDetails(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("id=13")
                .Returns<GetProductDetailsResponse>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetProductDetailsResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/Product/get?id=13&details=false")]
        public async Task GetProduct(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("id=13")
                .Returns<GetProductSummaryResponse>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetProductSummaryResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProductWithDetails(FindProductModel model)
        {
            var input = "v1/product/summary".BuildQuery(model).SetQueryParam("details", true);
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("find")
                .Returns<GetProductResponse>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetProductResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProduct(FindProductModel model)
        {
            var input = "v1/product/summary".BuildQuery(model).SetQueryParam("details", false);
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains("find")
                .Returns<FindSummaryResponse>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<FindSummaryResponse>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }
    }
}