//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadRenewalQuoteDetails;
using DRQD = DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadRenewalQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Quote.DownloadRenewalQuoteDetails.Handler
{
    public class HandlerTest
    {
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<DRQD.Handler>> _logger;
        private readonly Mock<IRenewalService> _renewalService;
        private readonly Mock<IRenewalQuoteDetailsDocumentGenerator> _docGen;

        private readonly DRQD.Handler _handler;

        public HandlerTest()
        {
            _mapper = new();
            _logger = new();
            _renewalService = new();
            _docGen = new();

            _handler = new DRQD.Handler(_renewalService.Object, _mapper.Object, _logger.Object, _docGen.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleShouldReturnContentAndNoErrors(List<QuoteDetailedModel> appRenewalServiceMockedResult)
        {
            _renewalService.Setup(x => x.GetRenewalsQuoteDetailedFor(
                      It.IsAny<GetRenewalQuoteDetailedRequest>()
                      ))
                  .ReturnsAsync(appRenewalServiceMockedResult);
            _docGen.Setup(x => x.XlsGenerate(It.IsAny<IRenewalQuoteDetailsDocumentModel>()))
                .ReturnsAsync(new byte[10]);
            var request = new Request { Id = "any" };
            
            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().BeOfType<Response>();
            result.Content.MimeType.Should().Be(mimeType);
            result.Content.BinaryContent.Should().NotBeNullOrEmpty();
        }

        internal class HandleShouldReturnEmptyContentAndNoErrorsData : TheoryData<List<QuoteDetailedModel>>
        {
            public HandleShouldReturnEmptyContentAndNoErrorsData()
            {
                Add(null);
                Add(new List<QuoteDetailedModel>());
            }
        }

        [Theory]
        [ClassData(typeof(HandleShouldReturnEmptyContentAndNoErrorsData))]
        public async Task HandleShouldReturnEmptyContentAndNoErrors(List<QuoteDetailedModel> appRenewalServiceMockedResult)
        {
            _renewalService.Setup(x => x.GetRenewalsQuoteDetailedFor(
                      It.IsAny<GetRenewalQuoteDetailedRequest>()
                      ))
                  .ReturnsAsync(appRenewalServiceMockedResult);
            _docGen.Setup(x => x.XlsGenerate(It.IsAny<IRenewalQuoteDetailsDocumentModel>()))
                .ReturnsAsync(new byte[10]);
            var request = new Request { Id = "any" };

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().BeOfType<Response>();
            result.Content.MimeType.Should().BeNullOrEmpty();
            result.Content.BinaryContent.Should().BeNullOrEmpty();
        }
    }
}
