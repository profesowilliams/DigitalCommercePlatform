using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails
{
    public sealed class GetCart
    {
        public class Request : IRequest<Response>
        {
            public string userId { get; set; }
            public string customerId { get; set; }

            public Request(string CustomerId, string UserId)
            {
                userId = UserId;
                customerId = CustomerId;
            }
        }

        public class Response
        {
            public string CartId { get; set; }
            public int CartItemCount { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
        }

        public class GetCartQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IContentService _contentService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetCart> _logger;

            public GetCartQueryHandler(IContentService contentService, IMapper mapper, ILogger<GetCart> logger)
            {
                _contentService = contentService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var response = await _contentService.GetCartDetails(request);
                    //var getcartResponse = _mapper.Map<GetCartResponse>(cartDetails);
                    return response;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetCart));
                    throw ex;
                }
            }
        }
    }
}
