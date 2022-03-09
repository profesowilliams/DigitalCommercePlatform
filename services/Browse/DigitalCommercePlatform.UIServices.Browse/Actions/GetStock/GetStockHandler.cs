//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.Stock;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetStock
{
    public class GetStockHandler
    {
        public class Handler : IRequestHandler<Request, StockModel>
        {
            private readonly IBrowseService _browseService;

            public Handler(IBrowseService browseService)
            {
                _browseService = browseService;
            }

            public async Task<StockModel> Handle(Request request, CancellationToken cancellationToken)
            {
                return await _browseService.GetStock(request);
            }
        }

        public class Request : IRequest<StockModel>
        {
            public Request(string id)
            {
                Id = id;
            }

            public string Id { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Id).NotEmpty();
            }
        }
    }
}