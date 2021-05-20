using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Order
{
    [ExcludeFromCodeCoverage]
    public sealed class DownloadInvoicePdf
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
            public string Filename { get; set; }

            public Response(string filename)
            {
                Filename = filename;
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
                    string filename = "DigitalCommercePlatform.UIServices.Commerce.data.invoice-sample.pdf";

                    Response response = new Response(filename);
                    return await Task.FromResult(new ResponseBase<Response> { Content = response });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(DownloadInvoicePdf)}");
                    throw;
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
}
