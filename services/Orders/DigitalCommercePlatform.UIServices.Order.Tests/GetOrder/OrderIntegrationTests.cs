//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.Models;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Newtonsoft.Json;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.Order.Tests.GetOrder
{
    public class OrderIntegrationTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture _fixture;

        public OrderIntegrationTests(UIFixture fixture, ITestOutputHelper output)
        {
            _fixture = fixture;
            TestOutput.Output = output;
        }


        private IScope PrepareGetScope(NuanceChatBotResponseModel model)
        {
            var scope = _fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
            .ForHttpMethod(HttpMethod.Get)
            .MatchContains("v1/GetOrder")
            .Returns(model).Build();

            return scope;
        }

        [Theory]
        [InlineDomainData("/v1/GetOrder")]
        public async Task GetOrderNotAllowed(string input, NuanceChatBotResponseModel model)
        {
            using var scope = PrepareGetScope(model);

            var client = _fixture.CreateClient().SetDefaultHeaders();
            client.DefaultRequestHeaders.Add("TraceId", "35345345-Browse");
            var response = await client.GetResult<NuanceChatBotResponseModel>(c => c.GetAsync(new Uri(input, UriKind.Relative))).ConfigureAwait(false);

            response.Response.StatusCode.Should().Be(HttpStatusCode.MethodNotAllowed);
        }
        //[Theory]
        //[InlineDomainData("/v1/GetOrder")]
        //public async Task GetOrderUnsupportedMediaType(string input, NuanceChatBotResponseModel model)
        //{
        //    using var scope = PrepareGetScope(model);

        //    var client = _fixture.CreateClient().SetDefaultHeaders();
        //    client.DefaultRequestHeaders.Add("TraceId", "35345345-Browse");
        //    var url = new Uri(input, UriKind.Relative);
        //    var response = await client.GetResult<NuanceChatBotResponseModel>(c => c.PostAsync(url, null)).ConfigureAwait(false);

        //    response.Response.StatusCode.Should().Be(HttpStatusCode.UnsupportedMediaType);
        //}
        //[Theory]
        //[InlineDomainData("/v1/GetOrder")]
        //public async Task GetOrderOK(string input, NuanceChatBotResponseModel model)
        //{
        //    using var scope = PrepareGetScope(model);

        //    var client = _fixture.CreateClient().SetDefaultHeaders();
        //    client.DefaultRequestHeaders.Add("TraceId", "35345345-Browse");
        //    var url = new Uri(input, UriKind.Relative);
        //    var httpContent = new StringContent(JsonConvert.SerializeObject(new NuanceWebChatRequest() {Header = new RequestHeader(), OrderQuery = new RequestOrderQuery()}), Encoding.UTF8, "application/json");
        //    var response = await client.GetResult<NuanceChatBotResponseModel>(c => c.PostAsync(url, httpContent)).ConfigureAwait(false);

        //    response.Response.StatusCode.Should().Be(HttpStatusCode.OK);
        //}
    }
}
