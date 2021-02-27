using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Client;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails
{
    public sealed class GetQuote
    {
        public class Request : IRequest<Response>
        {
            public string Id { get; }
            public bool Details { get; }
            public string AccessToken { get; }

            public Request(string id, bool details, string accessToken)
            {
                Id = id;
                Details = details;
                AccessToken = accessToken;
            }
        }

        public class Response
        {
            public QuoteModel Content { get; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(QuoteModel model)
            {
                Content = model;
            }
        }

        public class GetQuoteHandler : IRequestHandler<Request, Response>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetQuoteHandler(ICommerceService commerceQueryService, IMapper mapper)
            {
                _commerceQueryService = commerceQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var userDto = await _commerceQueryService.GetQuote(request.Id);
                throw new NotImplementedException();

                //return new Response(userDto);
            }
        }
    }
}
