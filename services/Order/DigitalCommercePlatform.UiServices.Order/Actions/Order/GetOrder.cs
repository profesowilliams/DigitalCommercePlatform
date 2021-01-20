using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIServices.Order.Infrastructure.Contracts;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Order
{
    public sealed class GetOrder
    {
        public class Request : IRequest<SalesOrderModel>
        {
            public string Id { get; set; }
        }

        public class Handler : OrderRequestHandler<Request, SalesOrderModel>
        {
            public Handler(
                IMapper mapper,
                ILogger<Handler> logger,
                IMiddleTierHttpClient client,
                IOptions<AppSettings> options) : base(mapper, logger, client, options)
            { }

            protected override void LogError(Exception exception)
                => Logger.LogError(exception, "Exception at: " + nameof(GetOrder));

            protected override async Task<SalesOrderModel> OnHandle(Request request, CancellationToken cancellationToke)
            {
                Logger.LogInformation($"AppService.Order.Id");
                var url = GetUrl(request.Id);

                var coreResponse = await Client.GetAsync<SalesOrderDto>(url.ToString(), null, null).ConfigureAwait(false);
                return Mapper.Map<SalesOrderModel>(coreResponse);
            }

            private Url GetUrl(string Id)
            {
                return CoreOrder
                    .AppendPathSegment(AppConstants.SalesOrderSegment)
                    .AppendPathSegment(Id);
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