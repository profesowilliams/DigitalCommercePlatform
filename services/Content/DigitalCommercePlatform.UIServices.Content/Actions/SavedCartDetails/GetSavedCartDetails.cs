using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Content.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails
{
    [ExcludeFromCodeCoverage]
    public sealed class GetSavedCartDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public bool IsCartName { get; set; } = false;

            public Request(string id, bool isCartName)
            {
                Id = id;
                IsCartName = isCartName;
            }
        }

        public class Response
        {
            public SavedCartDetailsModel Data { get; set; }
        }

        public class GetCartQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IContentService _contentService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetSavedCartDetails> _logger;

            public GetCartQueryHandler(IContentService contentService, IMapper mapper, ILogger<GetSavedCartDetails> logger)
            {
                _contentService = contentService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _contentService.GetSavedCartDetails(request);
                    var getProductResponse = _mapper.Map<Response>(cartDetails);
                    return new ResponseBase<Response> { Content = getProductResponse };
                }
                catch (UIServiceException ex)
                {
                    return new ResponseBase<Response>
                    {
                        Error = new ErrorInformation
                        {
                            Code = ex.ErrorCode,
                            IsError = true,
                            Messages = new List<string>() { ex.Message }
                        }
                    };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetSavedCartDetails));
                    throw ex;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.Id).NotNull();
            }
        }
    }
}
