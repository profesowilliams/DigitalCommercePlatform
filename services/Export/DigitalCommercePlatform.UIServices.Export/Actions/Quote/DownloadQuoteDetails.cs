//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Actions.Quote
{

    public sealed class DownloadQuoteDetails
    {
        public static readonly string mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        [ExcludeFromCodeCoverage]
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string QuoteId { get; set; }
            public AncillaryItem[] AncillaryItems { get; set; }
            public LineMarkup[] LineMarkup { get; set; }
            public string Logo { get; set; }

            public Request()
            {
                AncillaryItems = Array.Empty<AncillaryItem>();
                LineMarkup = Array.Empty<LineMarkup>();
            }
        }

        [ExcludeFromCodeCoverage]
        public class Response
        {
            public byte[] BinaryContent { get; set; }
            public string MimeType { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly ICommerceService _commerceService;
            private readonly IQuoteDetailsDocumentGenerator _documentGenerator;

            public Handler(ICommerceService commerceService,
                           IMapper mapper,
                           ILogger<Handler> logger,
                           IQuoteDetailsDocumentGenerator documentGenerator
                           )
            {
                _commerceService = commerceService;
                _mapper = mapper;
                _logger = logger;
                _documentGenerator = documentGenerator;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var getQuoteRequest = new GetQuote.Request(new List<string> { request.QuoteId }, true);
                var quoteModel = await _commerceService.GetQuote(getQuoteRequest);
                Response response = new();

                if (quoteModel != null)
                {
                    var quoteDetails = _mapper.Map<QuoteDetails>(quoteModel);
                    quoteDetails.Request = request;
                    var binaryContentXls = await _documentGenerator.XlsGenerate(quoteDetails);
                    DownloadableFile file = new (binaryContentXls, request.QuoteId + ".xls", mimeType);
                    response.BinaryContent = file.BinaryContent;
                    response.MimeType = file.MimeType;
                }

                return await Task.FromResult(new ResponseBase<Response> { Content = response });
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.QuoteId).NotEmpty();
            }
        }
    }
}
