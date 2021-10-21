//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
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
                AncillaryItems = System.Array.Empty<AncillaryItem>();
                LineMarkup = System.Array.Empty<LineMarkup>();
            }
        }

        [ExcludeFromCodeCoverage]
        public class Response
        {
            public byte[] BinaryContent { get; set; }
            public string MimeType { get; set; }

            public Response() {}

            public Response(byte[] binaryContent)
            {
                BinaryContent = binaryContent;
            }
        }

        [ExcludeFromCodeCoverage]
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly ICommerceService _commerceService;
            private readonly IExportService _helperService;

            public Handler(ICommerceService commerceService,
                           IMapper mapper,
                           ILogger<Handler> logger,
                           IExportService helperService)
            {
                _commerceService = commerceService;
                _mapper = mapper;
                _logger = logger;
                _helperService = helperService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var getQuoteRequest = new GetQuote.Request(new List<string> { request.QuoteId }, true);
                var quoteModel = await _commerceService.GetQuote(getQuoteRequest);
                Response response = new()
                {
                    MimeType = mimeType
                };

                if (quoteModel != null)
                {
                    var quoteDetails = _mapper.Map<QuoteDetails>(quoteModel);
                    var binaryContentXls = await _helperService.GetQuoteDetailsAsXls(quoteDetails, request);
                    DownloadableFile file = new (binaryContentXls, request.QuoteId + ".xls", mimeType);
                    response.BinaryContent = file.BinaryContent;
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
