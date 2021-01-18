using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Order
{
    public sealed class GetMultipleOrders
    {
        public class Request : IRequest<IEnumerable<SalesOrderModel>>
        {
            public IReadOnlyList<string> Id { get; set; }
        }

        public class Handler : OrderRequestHandler<Request, IEnumerable<SalesOrderModel>>
        {
            public Handler(
                IMapper mapper,
                ILogger<Handler> logger,
                IMiddleTierHttpClient client,
                IOptions<AppSettings> options) : base(mapper, logger, client, options)
            { }

            protected override void LogError(Exception exception)
                => Logger.LogError(exception, "Exception at: " + nameof(GetOrder));

            protected override async Task<IEnumerable<SalesOrderModel>> OnHandle(Request request, CancellationToken cancellationToke)
            {
                Logger.LogInformation("AppService.Order.Ids");
                var url = CoreOrder
                    .AppendPathSegment("SalesOrder")
                    .BuildQuery(request);

                var coreResponse = await Client.GetAsync<IEnumerable<SalesOrderDto>>(url).ConfigureAwait(false);
                return Mapper.Map<IEnumerable<SalesOrderModel>>(coreResponse);
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.Id).NotNull().NotEmpty();
            }
        }
    }
}