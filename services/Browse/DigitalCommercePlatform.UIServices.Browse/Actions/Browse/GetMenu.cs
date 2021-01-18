//using AutoMapper;
//using DigitalCommercePlatform.UIServices.Browse.DTO;
//using DigitalCommercePlatform.UIServices.Browse.DTO.Request;
//using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
//using DigitalCommercePlatform.UIServices.Browse.Helpers;
//using DigitalFoundation.Common.Client;
//using DigitalFoundation.Common.Settings;
//using DigitalFoundation.Core.Models.DTO.Common;
//using FluentValidation;
//using MediatR;
//using Microsoft.Extensions.Logging;
//using Microsoft.Extensions.Options;
//using System;
//using System.Collections.Generic;
//using System.Threading;
//using System.Threading.Tasks;

//namespace DigitalCommercePlatform.UIServices.Browse.Actions.Browse
//{
//    public class GetMenu
//    {
//        public class GetMenuRequest : IRequest<GetMenuResponse>
//        {
//            public string AccountNumber { get; set; }
//        }
//        public class GetMenuResponse : Response<MenuResponse>
//        {
//            public GetMenuResponse()
//            {
//            }

//            public GetMenuResponse(MenuResponse model)
//            {
//                ReturnObject = model;
//            }
//        }


//        public class Handler : IRequestHandler<GetMenuRequest, GetMenuResponse>
//        {
//            private readonly IMapper _mapper;
//            private readonly ILogger<Handler> _logger;
//            private readonly IMiddleTierHttpClient _client;
//            public string _appServicePath = string.Empty;

//            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory, IOptions<AppSettings> options)
//            {
//                _mapper = mapper;
//                _client = client;
//                _logger = loggerFactory.CreateLogger<Handler>();
//                _appServicePath = options?.Value.GetSetting("Core.Product.Url");
//            }            

//            public Task<GetMenuResponse> Handle(GetMenuRequest request, CancellationToken cancellationToken)
//            {
//                // read file 
//                var menu = GetMenuHelper.GetMenu(request.AccountNumber);
//                var result = new GetMenuResponse();
//                return Task.FromResult(result);
//            }
//        }

//        public class Validator : AbstractValidator<GetMenuRequest>
//        {
//            public Validator()
//            {
//                SetRules();
//            }

//            private void SetRules()
//            {
//                RuleFor(req => req.AccountNumber).NotNull().NotEmpty();
//            }
//        }
//    }

//}

