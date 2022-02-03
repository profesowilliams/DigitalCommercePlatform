//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Export.Actions.Order.DownloadOrderDetails;
using DOD = DigitalCommercePlatform.UIServices.Export.Actions.Order.DownloadOrderDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Order.DownloadOrderDetails.Handler
{
    public class HandlerTest
    {
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<DOD.Handler>> _logger;
        private readonly Mock<ICommerceService> _commerceService;
        private readonly Mock<IOrderDetailsDocumentGenerator> _docGen;

        private readonly DOD.Handler _handler;

        public HandlerTest()
        {
            _mapper = new();
            _logger = new();
            _commerceService = new();
            _docGen = new();

            _handler = new DOD.Handler(_commerceService.Object, _mapper.Object, _logger.Object, _docGen.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleShouldReturnContentAndNoErrors(OrderModel appCommerceServiceMockedResult, OrderDetailModel m)
        {
            _commerceService.Setup(x => x.GetOrderByIdAsync(It.IsAny<string>()))
                  .ReturnsAsync(appCommerceServiceMockedResult);
            _mapper.Setup(x => x.Map<OrderDetailModel>(appCommerceServiceMockedResult))
                .Returns(m);
            _docGen.Setup(x => x.XlsGenerate(It.IsAny<IOrderDetailsDocumentModel>()))
                .ReturnsAsync(new byte[10]);
            var request = new Request {
                OrderId = "any",
                ExportedFields = new[] { "mockedField1", "mockedField2" }.ToList()
            };
            
            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().BeOfType<Response>();
            result.Content.MimeType.Should().Be(mimeType);
            result.Content.BinaryContent.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task HandleShouldReturnEmptyContentAndNoErrors()
        {
            OrderModel orderModel = null;
            _commerceService.Setup(x => x.GetOrderByIdAsync(It.IsAny<string>()))
                  .ReturnsAsync(orderModel);
            _docGen.Setup(x => x.XlsGenerate(It.IsAny<IOrderDetailsDocumentModel>()))
                .ReturnsAsync(new byte[10]);
            var request = new Request
            {
                OrderId = "any",
                ExportedFields = new[] { "mockedField1", "mockedField2" }.ToList()
            };

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().BeOfType<Response>();
            result.Content.MimeType.Should().BeNullOrEmpty();
            result.Content.BinaryContent.Should().BeNullOrEmpty();
        }
    }
}
