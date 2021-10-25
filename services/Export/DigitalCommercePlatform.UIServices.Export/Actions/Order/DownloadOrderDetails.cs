//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using Internal = DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.IO.Compression;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Export.Models;

namespace DigitalCommercePlatform.UIServices.Export.Actions.Order
{
    public sealed class DownloadOrderDetails
    {
        [ExcludeFromCodeCoverage]
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string OrderId { get; set; }
            public List<string> ExportedFields { get; set; }
        }
        [ExcludeFromCodeCoverage]
        public class Response
        {
            public byte[] BinaryContent { get; set; }
            public string MimeType { get; set; }

            public Response(byte[] binaryContent)
            {
                BinaryContent = binaryContent;
            }

            public Response()
            {
            }
        }
        [ExcludeFromCodeCoverage]
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly ICommerceService _commerceService;
            private readonly IExportService _helperService;

            public Handler(ICommerceService commerceService,
                           IMapper mapper,
                           ILogger<Handler> logger,
                           IExportService helperService)
            {
                _commerceService = commerceService;
                _mapper = mapper;
                _logger = logger;
                _helperService = helperService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var orderModel = await _commerceService.GetOrderByIdAsync(request.OrderId);
                var orderDetails = _mapper.Map<OrderDetailModel>(orderModel);
                var binaryContentXls = await _helperService.GetOrderDetailsAsXls(orderDetails, request.ExportedFields);
                var file = new DownloadableFile(binaryContentXls, request.OrderId + ".xls", 
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

                var response = new Response()
                {
                    BinaryContent = file.BinaryContent,
                    MimeType = file.MimeType,
                };

                return await Task.FromResult(new ResponseBase<Response> { Content = response });
            }
        }
    }
}
