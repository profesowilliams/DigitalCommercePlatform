//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
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
    public class GetDownloadedRenewalQuoteDetailsTest
    {
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<DRQD.Handler>> _logger;
        private readonly Mock<IRenewalService> _renewalService;
        private readonly Mock<IRenewalQuoteDetailsDocumentGenerator> _docGen;

       

        public GetDownloadedRenewalQuoteDetailsTest()
        {
            _mapper = new Mock<IMapper>();
            _logger = new Mock<ILogger<DRQD.Handler>>();
            _renewalService = new Mock<IRenewalService>();
            _docGen = new Mock<IRenewalQuoteDetailsDocumentGenerator>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDownloadedRenewalQuoteDetails(List<QuoteDetailedModel> expected)
        {
            _renewalService.Setup(x => x.GetRenewalsQuoteDetailedFor(
                      It.IsAny<GetRenewalQuoteDetailedRequest>()
                      ))
                  .ReturnsAsync(expected);
            var request = new Request { Id = "any" };
            var handler = new DRQD.Handler(_renewalService.Object, _mapper.Object, _logger.Object, _docGen.Object);
            
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}
