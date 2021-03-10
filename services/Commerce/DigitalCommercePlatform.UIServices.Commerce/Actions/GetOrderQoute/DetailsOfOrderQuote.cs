using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute
{
    public class DetailsOfOrderQuote
    {
        public class Request : IRequest<Response>
        {
            public string UserId { get; set; }
            public string ProductId { get; set; }

            public Request(string UserId, bool ProductId, string accessToken)
            {
                userId = UserId;
                productId = ProductId;
            }
        }

        public class Response
        {
            public QuoteDetailModel QuoteDetailModel { get; set; }
        }
        public class GetQuoteHandler : IRequestHandler<Request, Response>
        {
            private readonly ICommerceService _quoteService;
            private readonly IMapper _mapper;

            public GetQuoteHandler(ICommerceService quoteService, IMapper mapper)
            {
                _quoteService = quoteService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var userDto = await _quoteService.GetQuote(request.Id);
                throw new NotImplementedException();

                //return new Response(userDto);
            }
        }
    }

}
