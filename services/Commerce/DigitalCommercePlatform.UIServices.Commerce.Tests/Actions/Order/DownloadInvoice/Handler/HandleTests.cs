//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Common;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using DI = DigitalCommercePlatform.UIServices.Commerce.Actions.Order.DownloadInvoice;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Order.DownloadInvoice.Handler
{
    [ExcludeFromCodeCoverage]
    public class HandleTests : HandlerTestsBase, IClassFixture<InitDownloadInvoiceHandlerFixture>
    {
        private readonly InitDownloadInvoiceHandlerFixture _fixture;
        private readonly DI.Handler _handler;

        public HandleTests(InitDownloadInvoiceHandlerFixture fixture)
            : base(fixture)
        {
            _fixture = fixture;
            _handler = GetHandler();
        }

        private DI.Handler GetHandler() => new(_mockOrderService.Object, _mockMapper.Object);

        [Fact]
        public async Task ShouldReturnSinglePdfFileForValidInvoiceId()
        {
            DI.Request request = new() { InvoiceId = "anyInvoiceId" };

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<DI.Response>>();
            result.Content.Should().NotBeNull();
            result.Content.MimeType.Should().Be(DI.PdfMimeType);
            result.Content.BinaryContent.Should().HaveCount(_fixture.MockedDataSize);
            result.Content.BinaryContent.Should().BeEquivalentTo(_fixture.MockedPdfBinaryData);
        }

        internal class ShouldReturnSingleZipFileWhenDownloadAllValidData : TheoryData<DI.Request>
        {
            public ShouldReturnSingleZipFileWhenDownloadAllValidData()
            {
                Add(new DI.Request("o1", null, true));
                Add(new DI.Request("o2", "i2", true));
                Add(new DI.Request(null, "i3", true));
            }
        }

        [Theory]
        [ClassData(typeof(ShouldReturnSingleZipFileWhenDownloadAllValidData))]
        public async Task ShouldReturnSingleZipFileWhenDownloadAll(DI.Request request)
        {
            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<DI.Response>>();
            result.Content.Should().NotBeNull();
            result.Content.MimeType.Should().Be(DI.ZipMimeType);
        }

        [Fact]
        public async Task ShouldReturnSingleZipFile()
        {
            _mockOrderService.Setup(x => x.GetInvoicesFromOrderIdAsync(It.IsAny<string>()))
                .ReturnsAsync(new List<InvoiceModel>()
                {
                    new InvoiceModel() { ID = "id1" },
                    new InvoiceModel() { ID = "id2" },
                    new InvoiceModel() { ID = "id3" },
                });
            DI.Request request = new("o1", null, false);

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<DI.Response>>();
            result.Content.Should().NotBeNull();
            result.Content.MimeType.Should().Be(DI.ZipMimeType);
        }
    }
}
