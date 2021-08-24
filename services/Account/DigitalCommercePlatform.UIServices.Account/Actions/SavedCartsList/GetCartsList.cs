//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

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
            public List<SavedCartsResponse> Items { get; set; }
            public int? TotalRecords { get; set; }
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
                var cartDetails = await _accountServices.GetSavedCartListAsync(request);
                var cartResponse = _mapper.Map<List<SavedCartsResponse>>(cartDetails);
                var getcartResponse = _mapper.Map<Response>(cartResponse);
                return new ResponseBase<Response> { Content = getcartResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Count).NotNull();
            }
        }
    }
}
