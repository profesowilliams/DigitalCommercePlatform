using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;

namespace DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList
{
    [ExcludeFromCodeCoverage]
    public static class GetCartsList
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public bool GetAll { get; set; } = true;
            public int Count { get; set; } = 100;

            public Request(bool getAll, int count)
            {
                GetAll = getAll; // fix this
                Count = count;
            }
        }

        public class Response
        {
            public SavedCart SavedCarts { get; set; }
        }
        public class GetSavedCartsQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountServices;
            private readonly IMapper _mapper;
            private readonly ILogger<GetSavedCartsQueryHandler> _logger;

            public GetSavedCartsQueryHandler(IAccountService accountServices, 
                IMapper mapper, 
                ILogger<GetSavedCartsQueryHandler> logger)
            {
                _accountServices = accountServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _accountServices.GetSavedCartListAsync(request);
                    var getcartResponse = _mapper.Map<Response>(cartDetails);
                    return new ResponseBase<Response> { Content = getcartResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting users saved cart(s) : " + nameof(GetCartsList));
                    throw;
                }
            }
        }
    }
}
