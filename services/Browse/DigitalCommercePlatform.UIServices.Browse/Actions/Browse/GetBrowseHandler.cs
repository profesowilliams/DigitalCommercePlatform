using AutoMapper;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Core.Models.DTO.Common;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Actions.Browse.GetBrowse;
using DigitalCommercePlatform.UIServices.Browse.DTO.Request;
using DigitalCommercePlatform.UIServices.Browse.DTO.Response;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Browse.GetBrowse
{
    public class GetBrowseHandler : IRequestHandler<GetBrowseRequest, GetBrowseResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IMiddleTierHttpClient _client;
        private readonly string CoreBrowseUrl;
        public GetBrowseHandler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory,
                IOptions<AppSettings> options)
        {
            _mapper = mapper;
            _client = client;
            _logger = loggerFactory.CreateLogger<GetBrowseHandler>();

            const string key = "Core.Browse.Url";
            CoreBrowseUrl = options?.Value?.TryGetSetting(key);
            if (CoreBrowseUrl is null) throw new InvalidOperationException($"{key} is missing from {nameof(IOptions<AppSettings>)}");
        }
        public async Task<GetBrowseResponse> Handle(GetBrowseRequest request, CancellationToken cancellationToken)
        {

            try
            {
                _logger.LogInformation($"AppService.Browse.Id");
                var url = CoreBrowseUrl
                    .BuildQuery(request);

                //var coreResponse = await _client.GetAsync<PaginatedResponse<List<CoreBrowse>>>(url).ConfigureAwait(false);
                //return _mapper.Map<GetBrowseResponse>(coreResponse);
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at: " + nameof(GetBrowse));
                throw;
            }
        }
    }
}
