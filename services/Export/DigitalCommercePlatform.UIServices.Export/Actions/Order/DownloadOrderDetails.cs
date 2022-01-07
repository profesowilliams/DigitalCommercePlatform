//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Actions.Order
{
    [ExcludeFromCodeCoverage]
    public sealed class DownloadOrderDetails
    {
        public static readonly string mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        public class Request : IRequest<ResponseBase<Response>>
        {
            public string OrderId { get; set; }
            public List<string> ExportedFields { get; set; }
        }

        public class Response
        {
            public byte[] BinaryContent { get; set; }
            public string MimeType { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly ICommerceService _commerceService;
            private readonly IOrderDetailsDocumentGenerator _documentGenerator;

            public Handler(ICommerceService commerceService,
                           IMapper mapper,
                           ILogger<Handler> logger,
                           IOrderDetailsDocumentGenerator documentGenerator)
            {
                _commerceService = commerceService;
                _mapper = mapper;
                _logger = logger;
                _documentGenerator = documentGenerator;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var orderModel = await _commerceService.GetOrderByIdAsync(request.OrderId);
                var orderDetailsDocumentModel = _mapper.Map<OrderDetailModel>(orderModel);
                orderDetailsDocumentModel.ExportedFields = request.ExportedFields;
                var binaryContentXls = await _documentGenerator.XlsGenerate(orderDetailsDocumentModel);
                var file = new DownloadableFile(binaryContentXls, request.OrderId + ".xls", mimeType);

                var response = new Response()
                {
                    BinaryContent = file.BinaryContent,
                    MimeType = file.MimeType,
                };

                return await Task.FromResult(new ResponseBase<Response> { Content = response });
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.OrderId).NotEmpty();
            }
        }
    }
}
