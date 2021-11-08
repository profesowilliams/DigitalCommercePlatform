//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Order
{
    public sealed class DownloadInvoice
    {
        public static readonly string PdfMimeType = "application/pdf";
        public static readonly string ZipMimeType = "application/zip";

        [ExcludeFromCodeCoverage]
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string OrderId { get; set; }
            public string InvoiceId { get; set; }
            public bool DownloadAll { get; set; }

            public Request() { }

            public Request(string orderId, string invoiceId, bool downloadAll)
            {
                OrderId = orderId;
                InvoiceId = invoiceId;
                DownloadAll = downloadAll;
            }
        }

        [ExcludeFromCodeCoverage]
        public class Response
        {
            public byte[] BinaryContent { get; set; }
            public string MimeType { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IOrderService _orderService;
            private readonly IMapper _mapper;

            public Handler(IOrderService orderService, IMapper mapper)
            {
                _orderService = orderService;
                _mapper = mapper;
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

                var listFiles = new List<DownloadableFile>(listInvoiceIds.Count);
                foreach (var invoiceId in listInvoiceIds)
                {
                    var binaryContentPdf = await _orderService.GetPdfInvoiceAsync(invoiceId);
                    if (binaryContentPdf != null)
                    {
                        var invoiceFile = new DownloadableFile(binaryContentPdf, invoiceId + ".pdf", PdfMimeType);
                        listFiles.Add(invoiceFile);
                    }
                }

                var response = new Response();
                if (listFiles.Count == 1 && !request.DownloadAll)
                {
                    var file = listFiles.Single();
                    response.BinaryContent = file.BinaryContent;
                    response.MimeType = file.MimeType;
                }
                else
                {
                    response.BinaryContent = GenerateZipFile(listFiles);
                    response.MimeType = ZipMimeType;
                }
                return await Task.FromResult(new ResponseBase<Response> { Content = response });
            }

            [ExcludeFromCodeCoverage]
            private static byte[] GenerateZipFile(List<DownloadableFile> listDownloadableFiles)
            {
                byte[] archiveFile;
                using MemoryStream zipStream = new();
                using (ZipArchive zip = new(zipStream, ZipArchiveMode.Create, leaveOpen: true))
                {
                    foreach (var file in listDownloadableFiles)
                    {
                        var entry = zip.CreateEntry(file.Filename);
                        using MemoryStream sourceStream = new(file.BinaryContent);
                        using StreamWriter entryStream = new(entry.Open());
                        sourceStream.CopyTo(entryStream.BaseStream);
                    }
                }
                archiveFile = zipStream.ToArray();
                return archiveFile;
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.OrderId).NotEmpty();
            }
        }
    }
}
