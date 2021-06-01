using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Order
{
    [ExcludeFromCodeCoverage]
    public sealed class DownloadInvoice
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string OrderId { get; set; }
            public string InvoiceId { get; set; }
            public bool DownloadAll { get; set; }

            public Request(string orderId, string invoiceId, bool downloadAll)
            {
                OrderId = orderId;
                InvoiceId = invoiceId;
                DownloadAll = downloadAll;
            }
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
            private readonly ICommerceService _quoteService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(ICommerceService quoteService, IMapper mapper, ILogger<Handler> logger)
            {
                _quoteService = quoteService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var filenames = new List<string>()
                    {
                        "DigitalCommercePlatform.UIServices.Commerce.data.invoice-sample.pdf",
                        "DigitalCommercePlatform.UIServices.Commerce.data.invoice-sample-2.pdf"
                    };

                    var response = new Response();
                    if (request.DownloadAll)
                    {
                        response.BinaryContent = GenerateZipFile(filenames);
                        response.MimeType = "application/zip";
                        return await Task.FromResult(new ResponseBase<Response> { Content = response });
                    }
                    else
                    {
                        var filename = filenames.First();
                        // Temporary solution to let QA test with at least 2 different PDFs
                        if (request.OrderId == "6021771625")
                        {
                            filename = filenames.Last();
                        }
                        using (var resourceStream = GetType().Assembly.GetManifestResourceStream(filename))
                        {
                            BinaryReader reader = new BinaryReader(resourceStream);
                            response.BinaryContent = reader.ReadBytes((int)reader.BaseStream.Length);
                        }
                        response.MimeType = "application/pdf";
                        return await Task.FromResult(new ResponseBase<Response> { Content = response });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(DownloadInvoice)}");
                    throw;
                }
            }

            private byte[] GenerateZipFile(List<string> filenames)
            {
                byte[] archiveFile;
                using (MemoryStream zipStream = new MemoryStream())
                {

                    using (ZipArchive zip = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true))
                    {
                        foreach (var filename in filenames)
                        {
                            var entry = zip.CreateEntry(filename);
                            using (var resourceStream = this.GetType().Assembly.GetManifestResourceStream(filename))
                            {
                                using (StreamWriter entryStream = new StreamWriter(entry.Open()))
                                {
                                    resourceStream.CopyTo(entryStream.BaseStream);
                                }
                            }
                        }
                    }
                    zipStream.Position = 0;
                    archiveFile = zipStream.ToArray();
                    return archiveFile;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.OrderId).NotNull();
            }
        }
    }
}
