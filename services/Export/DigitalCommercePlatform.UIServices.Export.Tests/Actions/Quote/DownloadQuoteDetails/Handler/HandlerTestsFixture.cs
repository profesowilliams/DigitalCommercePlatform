//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using static DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadQuoteDetails;
using DQD = DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Quote.DownloadQuoteDetails.Handler
{
    public class HandlerTestsFixture
    {
        readonly Mock<ICommerceService> mCommerceService;
        readonly Mock<ILogger<DQD.Handler>> mLogger;
        readonly Mock<IQuoteDetailsDocumentGenerator> mDocGen;

        readonly Mock<IMapper> mMapper;
        readonly IMapper mapper;

        public IRequestHandler<Request, ResponseBase<Response>> Handler;

        public HandlerTestsFixture()
        {
            mCommerceService = new ();
            mMapper = new ();
            mLogger = new ();
            mDocGen = new ();

            mCommerceService.Setup(x => x.GetQuote(It.IsAny<GetQuote.Request>()))
                .ReturnsAsync(new QuoteModel());

            var myProfile = new ExportProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);

            //mMapper.Setup(m => m.Map<QuoteModel, QuoteDetails>(It.IsAny<QuoteModel>()))
            //    .Returns(new QuoteDetails());

            mDocGen.Setup(x => x.XlsGenerate(It.IsAny<IQuoteDetailsDocumentModel>()))
                .ReturnsAsync(new byte[10]);

            Handler = CreateHandler();
        }

        private IRequestHandler<Request, ResponseBase<Response>> CreateHandler()
        {
            return new DQD.Handler(mCommerceService.Object,
                //mMapper.Object,
                mapper,
                mLogger.Object,
                mDocGen.Object);
        }
    }
}
