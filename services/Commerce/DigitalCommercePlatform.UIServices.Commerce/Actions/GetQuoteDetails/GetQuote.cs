using AutoMapper;
using Azure;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Client;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfSavedCartsQuote;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails
{
    public sealed class GetQuote
    {
        public class Request : IRequest<Response>
        {
            public IReadOnlyCollection<string> Id { get; set; }
            public bool Details { get; set; }

            public Request(IReadOnlyCollection<string> id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        public class Response 
        {
            public QuoteModel Details { get; set; }
            //public int? TotalItems { get; set; }
            //public int PageNumber { get; set; }
            //public int PageSize { get; set; }
            public bool IsError { get; internal set; }
            public string ErrorCode { get; internal set; }
            public string ErrorDescription { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICommerceService _commerceRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(ICommerceService commerceRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _commerceRepositoryServices = commerceRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _commerceRepositoryServices.GetQuote(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<Response>(productDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                SetRules();
            }

            private void SetRules()
            {
                RuleFor(r => r.Id).NotEmpty();
            }
        }
    }
}
