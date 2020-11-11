using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.DTO.Request;
using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
//using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DigitalFoundation.Core.Models.DTO.Common;
using DigitalCommercePlatform.UIServices.Browse.DTO;
using System.Text;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Browse
{
    public class GetMenu
    { 
        public class GetMenuRequestDetails : IRequest<GetMenuResponse>
    {
        public ICollection<Menu> Criteria;

        public GetMenuRequestDetails(ICollection<Menu> criteria)
        {
            Criteria = criteria;
        }
    }

    public class GetMenuResponseDetails : Response<IEnumerable<Menu>>
    {
        //public GetMenuResponse()
        //{
        //}

        public GetMenuResponseDetails(IEnumerable<Menu> model)
        {
            ReturnObject = model;
        }
    }

    public class Handler : IRequestHandler<GetMenuRequest, GetMenuResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<Handler> _logger;
        private readonly IMiddleTierHttpClient _client;
        public string _coreServicePath = string.Empty;

        public Handler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory, IOptions<AppSettings> options)
        {
            _mapper = mapper;
            _client = client;
            _logger = loggerFactory.CreateLogger<Handler>();
            _coreServicePath = options?.Value.GetSetting("Core.Customer.Url");
        }

            public async Task<GetMenuResponse> Handle(GetMenuRequest request, CancellationToken cancellationToken)
            {
                string queryParameters = string.Empty;
                //if (request != null)
                //    queryParameters = GetQueryString(request);

                var requestPath = $"{_coreServicePath}v1/?{queryParameters}";
                try
                {
                    var customerResponse = await _client
                        .GetAsync<IEnumerable<Menu>>(requestPath)
                        .ConfigureAwait(false);

                    var dtoList = _mapper.Map<IEnumerable<Menu>>(customerResponse);

                    return null;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Exception on request to {requestPath}");
                }

                return null;
            }
        }
    }
    
}

