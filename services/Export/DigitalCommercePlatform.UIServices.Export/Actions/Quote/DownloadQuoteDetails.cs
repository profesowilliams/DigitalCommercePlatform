//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.IO.Compression;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Actions.Quote
{
    [ExcludeFromCodeCoverage]
    public sealed class DownloadQuoteDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string QuoteId { get; set; }
            public LineMarkup[] LineMarkup { get; set; }
            public string Logo { get; set; }
        }

        public class Response
        {
            public byte[] BinaryContent { get; set; }
            public string MimeType { get; set; }

            public Response(byte[] binaryContent)
            {
                BinaryContent = binaryContent;
            }

            public Response()
            {
            }
        }

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
                var quoteDetails = _mapper.Map<QuoteDetails>(quoteModel);
                var binaryContentXls = await _helperService.GetQuoteDetailsAsXls(quoteDetails, request.Logo, request.LineMarkup);
                var file = new DownloadableFile(binaryContentXls, request.QuoteId + ".xls", 
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                //var file = new DownloadableFile(binaryContentXls, request.QuoteId + ".xls", "application/vnd.ms-excel");

                var response = new Response()
                {
                    BinaryContent = file.BinaryContent,
                    MimeType = file.MimeType,
                };

                return await Task.FromResult(new ResponseBase<Response> { Content = response });
            }

            protected static byte[] GenerateZipFile(List<DownloadableFile> listDownloadableFiles)
            {
                byte[] archiveFile;
                using (MemoryStream zipStream = new ())
                {

                    using (ZipArchive zip = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true))
                    {
                        foreach (var file in listDownloadableFiles)
                        {
                            var entry = zip.CreateEntry(file.Filename);
                            using (var sourceStream = new MemoryStream(file.BinaryContent))
                            {
                                using (StreamWriter entryStream = new StreamWriter(entry.Open()))
                                {
                                    sourceStream.CopyTo(entryStream.BaseStream);
                                }
                            }
                        }
                    }
                    archiveFile = zipStream.ToArray();
                    return archiveFile;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.QuoteId).NotNull();
            }
        }
    }
}
