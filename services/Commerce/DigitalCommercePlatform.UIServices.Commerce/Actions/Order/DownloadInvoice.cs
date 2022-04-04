//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
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
            private readonly ILogger<Handler> _logger;
            public Handler(IOrderService orderService, ILogger<Handler> logger, IMapper mapper)
            {
                _orderService = orderService;
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
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
                    else if (listFiles.Count==0)
                    {
                        _logger.LogError(request.InvoiceId + " InvoiceId is Not found to download " + nameof(CommerceService));
                        throw new UIServiceException(request.InvoiceId + " InvoiceId is Not found to download", 404);
                    }
                    else
                    {
                        response.BinaryContent = GenerateZipFile(listFiles);
                        response.MimeType = ZipMimeType;
                    }
                    return await Task.FromResult(new ResponseBase<Response> { Content = response });
                }
                catch (RemoteServerHttpException ex)
                {
                    _logger.LogError(ex, "RemoteServerHttpException while downloading order Pdf: " + nameof(CommerceService));
                    throw new UIServiceException(ex.Message, (int)ex.Code);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("404"))
                    {
                        _logger.LogError(request.InvoiceId + " InvoiceId is Not found to download " + nameof(CommerceService));
                        throw new UIServiceException(request.InvoiceId + " InvoiceId is Not found to download", 404);
                    }
                    else
                    {
                        _logger.LogError(ex, "Error while downloading order Pdf: " + nameof(CommerceService));
                        throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                    }
                }
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
