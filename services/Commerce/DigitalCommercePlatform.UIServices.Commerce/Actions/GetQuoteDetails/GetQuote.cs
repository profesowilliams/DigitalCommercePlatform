using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails
{
    [ExcludeFromCodeCoverage]
    public sealed class GetQuote
    {
        public class Request : IRequest<Response>
        {
            public IReadOnlyCollection<string> Id { get; set; }
            public bool Details { get; set; }

            //public RequestHeaders Headers { get; set; }

            public Request(IReadOnlyCollection<string> id, bool details)
            {
                Id = id;
                Details = details;
              // Headers = new RequestHeaders();
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
                    var getQuoteResponse = new Response();
                    var productDetails = await _commerceRepositoryServices.GetQuote(request).ConfigureAwait(false);
                    if (productDetails != null)
                    {

                        getQuoteResponse = _mapper.Map<Response>(productDetails);
                        getQuoteResponse.IsError = false;
                        getQuoteResponse.ErrorCode = "200";
                    }
                    else 
                    {
                        getQuoteResponse.Details = null;
                        getQuoteResponse.ErrorCode = "400";
                        getQuoteResponse.IsError = true;
                        getQuoteResponse.ErrorDescription = "Bad Request"; 
                    }
                    return getQuoteResponse;
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
