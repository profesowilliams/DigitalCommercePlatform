using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Models;
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
            private readonly IOrderService _orderService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IOrderService orderService, IMapper mapper, ILogger<Handler> logger)
            {
                _orderService = orderService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var listInvoiceIds = new List<string>();
                if (request.InvoiceId != null)
                {
                    listInvoiceIds.Add(request.InvoiceId);
                }
                else
                {
                    var listInvoices = await _orderService.GetInvoicesFromOrderIdAsync(request.OrderId);
                    foreach (var invoice in listInvoices)
                    {
                        listInvoiceIds.Add(invoice.ID);
                    }
                }

                var listFiles = new List<DownloadableFile>();
                foreach (var invoiceId in listInvoiceIds)
                {
                    var binaryContentPdf = await _orderService.GetPdfInvoiceAsync(invoiceId);
                    var invoiceFile = new DownloadableFile(binaryContentPdf, request.InvoiceId + ".pdf", "application/pdf");
                    listFiles.Add(invoiceFile);
                }

                var response = new Response();
                if (listFiles.Count == 0) { return await Task.FromResult(new ResponseBase<Response> { Content = response }); }
                if (listFiles.Count == 1 && !request.DownloadAll)
                {
                    var file = listFiles.Single();
                    response.BinaryContent = file.BinaryContent;
                    response.MimeType = file.MimeType;
                    return await Task.FromResult(new ResponseBase<Response> { Content = response });
                }
                else
                {
                    response.BinaryContent = GenerateZipFile(listFiles);
                    response.MimeType = "application/zip";
                    return await Task.FromResult(new ResponseBase<Response> { Content = response });
                }
            }

            private static byte[] GenerateZipFile(List<DownloadableFile> listDownloadableFiles)
            {
                byte[] archiveFile;
                using (MemoryStream zipStream = new MemoryStream())
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
                RuleFor(c => c.OrderId).NotNull();
            }
        }
    }
}
