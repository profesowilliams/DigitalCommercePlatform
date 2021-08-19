using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary
{
    [ExcludeFromCodeCoverage]
    public sealed class GetActionItems
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
        }

        public class Response
        {
            public ActionItemsModel Summary { get; set; }
        }

        public class ActionItemsSummaryQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<ActionItemsSummaryQueryHandler> _logger;

            public ActionItemsSummaryQueryHandler(IAccountService accountService,
                IMapper mapper,
                ILogger<ActionItemsSummaryQueryHandler> logger
                )
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                ActionItemsModel actionItems = await _accountService.GetActionItemsSummaryAsync(request);
                var getActionItems = _mapper.Map<Response>(actionItems);
                return new ResponseBase<Response> { Content = getActionItems };
            }
        }

        
    }
}