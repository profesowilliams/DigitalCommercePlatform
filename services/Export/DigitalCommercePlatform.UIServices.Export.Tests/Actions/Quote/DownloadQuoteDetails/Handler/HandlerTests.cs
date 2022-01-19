//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentAssertions;
using MediatR;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Quote.DownloadQuoteDetails.Handler
{
    public class HandlerTests : IClassFixture<HandlerTestsFixture>
    {
        public IRequestHandler<Request, ResponseBase<Response>> Handler;

        public HandlerTests(HandlerTestsFixture fixture)
        {
            Handler = fixture.Handler;
        }

        [Fact]
        public async Task HandleShouldReturnContentAndNoErrors()
        {
            var request = new Request { QuoteId = "any" };
            var result = await Handler.Handle(request, new System.Threading.CancellationToken());

            result.Should().BeOfType<ResponseBase<Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().BeOfType<Response>();
            result.Content.MimeType.Should().Be(mimeType);
            result.Content.BinaryContent.Should().NotBeNullOrEmpty();
        }
    }
}
