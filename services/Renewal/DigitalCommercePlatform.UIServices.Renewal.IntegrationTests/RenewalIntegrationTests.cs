//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using static DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals.GetRenewalQuoteDetailed;

namespace DigitalCommercePlatform.UIServices.Renewal.IntegrationTests
{
    public class RenewalIntegrationTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture _fixture;

        public RenewalIntegrationTests(UIFixture fixture, ITestOutputHelper output)
        {
            _fixture = fixture;
            TestOutput.Output = output;
        }

        [Theory]
        [InlineDomainData("/v1/details?id=4009724298&type=renewal")]
        public async Task App_Get_ReturnsQuoteDetailed(string input, IEnumerable<QuoteDetailedDto> model)
        {
            using var scope = PrepareGetScope(model);

            var client = _fixture.CreateClient().SetDefaultHeaders();
            client.DefaultRequestHeaders.Add("TraceId", "35345345-Browse");
            var response = await client.GetResult<ResponseBase<Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative))).ConfigureAwait(false);

            response.Response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Value.Content.Should().NotBeNull();
            response.Value.Content.Details.Should().NotBeEmpty();
        }

        private IScope PrepareGetScope(IEnumerable<QuoteDetailedDto> model)
        {
            var scope = _fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
            .ForHttpMethod(HttpMethod.Get)
            .MatchContains("v1?Id=4009724298&Type=renewal")
            .Returns(model).Build();

            return scope;
        }

        private IScope PrepareGetScope(IEnumerable<SummaryDto> model)
        {
            var scope = _fixture.CreateChildScope();
            scope.OverrideClient<IMiddleTierHttpClient>()
            .ForHttpMethod(HttpMethod.Get)
            .MatchContains("v1/Search?Page=1&PageSize=100&details=false&withpaginationinfo=false&Details=false")
            .Returns(model).Build();

            return scope;
        }

        [Theory]
        [InlineDomainData("/v1/Search?Page=1&PageSize=100&details=false&withpaginationinfo=false&Details=false")]
        public async Task App_Get_ReturnsSearchDetailed(string input, IEnumerable<SummaryDto> model)
        {
            using var scope = PrepareGetScope(model);

            var client = _fixture.CreateClient().SetDefaultHeaders();
            client.DefaultRequestHeaders.Add("TraceId", "35345345-Browse");
            var response = await client.GetResult<ResponseBase<SearchRenewalSummary.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative))).ConfigureAwait(false);

            response.Response.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}