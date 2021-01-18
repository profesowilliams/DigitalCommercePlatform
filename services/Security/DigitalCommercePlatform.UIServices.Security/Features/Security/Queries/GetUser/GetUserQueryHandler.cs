using AutoMapper;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    public class GetUserAndTokenQueryHandler : IRequestHandler<GetUserQuery, GetUserResponse>
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _coreSecurityUrl;
        private const string AppSettingsNameForCoreSecurityUrl = "Core.Security.Url";
        private readonly IMapper _mapper;

        public GetUserAndTokenQueryHandler(IMiddleTierHttpClient middleTierHttpClient, IOptions<AppSettings> appSettingsOptions, IMapper mapper)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(AppSettingsNameForCoreSecurityUrl) ?? throw new InvalidOperationException($"{AppSettingsNameForCoreSecurityUrl} is missing from AppSettings");
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<GetUserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var validateUserRequestModel = new ValidateUserRequestModel
            {
                Address = _coreSecurityUrl,
                ApplicationName = request?.ApplicationName,
                Token = AuthenticationHeaderValue.Parse(request?.Authorization).Parameter
            };

            var userDto = await _middleTierHttpClient.ValidateUserAsync(validateUserRequestModel).ConfigureAwait(false);

            var userResponse = _mapper.Map<GetUserResponse>(userDto);

            return userResponse;
        }
    }
}
