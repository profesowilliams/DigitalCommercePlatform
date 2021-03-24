using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
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
            public string Criteria { get; set; }
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
                try
                {
                    ActionItemsModel actionItems = await _accountService.GetActionItemsSummaryAsync(request);
                    var getActionItems = _mapper.Map<Response>(actionItems);
                    return new ResponseBase<Response> { Content = getActionItems };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting ConfigurationsSummaryQueryHandler  : " + nameof(ActionItemsSummaryQueryHandler));
                    throw;
                }

            }
        }
    }
}
