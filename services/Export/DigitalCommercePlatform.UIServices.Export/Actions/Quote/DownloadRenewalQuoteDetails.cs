//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Actions.Quote
{

    public sealed class DownloadRenewalQuoteDetails
    {
        public const string mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        [ExcludeFromCodeCoverage]
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
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
            private readonly IRenewalService _renewalService;
            private readonly IRenewalQuoteDetailsDocumentGenerator _documentGenerator;

            public Handler(IRenewalService renewalService,
                           IMapper mapper,
                           ILogger<Handler> logger,
                           IRenewalQuoteDetailsDocumentGenerator documentGenerator
                           )
            {
                _renewalService = renewalService;
                _mapper = mapper;
                _logger = logger;
                _documentGenerator = documentGenerator;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                GetRenewalQuoteDetailedRequest getRenewalRequest = new();
                getRenewalRequest.Id = new string[] { request.Id };
                getRenewalRequest.Type = "Renewal";

                List<QuoteDetailedModel> quoteDetailedModels = await _renewalService.GetRenewalsQuoteDetailedFor(getRenewalRequest);

                //call product service to get products details

                Response response = new();
                if (quoteDetailedModels?.Count > 0)
                {
                    var binaryContentXls = await _documentGenerator.XlsGenerate(quoteDetailedModels[0]);
                    DownloadableFile file = new(binaryContentXls, request.Id + ".xls", mimeType);
                    response.BinaryContent = file.BinaryContent;
                    response.MimeType = file.MimeType;
                }

                return new ResponseBase<Response> { Content = response };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }
    }
}
