//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Threading.Tasks;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Security.Exceptions;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using Flurl;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure;

public interface IUserInfoService
{
    User LookupUserData(string userId, string resellerId);
}

public class UserInfoService : IUserInfoService
{
    private readonly ILogger<UserInfoService> _logger;
    private readonly IDigitalFoundationClient _httpClient;

    private readonly string _userServiceAddress;

    public UserInfoService(ILogger<UserInfoService> logger, IAppSettings appSettings, IDigitalFoundationClient httpClient)
    {
        _logger = logger;
        _httpClient = httpClient;

        _userServiceAddress = appSettings.GetSetting("Core.Security.Url");
    }

    public User LookupUserData(string userId, string resellerId)
    {
        User retUser = null;

        try
        {
            retUser = GetUserInfoAsync(userId).ConfigureAwait(false).GetAwaiter().GetResult();
        }
        catch (UnauthorizedImpersonationRequestException)
        {
            _logger.LogError("Authentication Failed. Not allowed to get User data via impersonation");
            return null;
        }

        retUser.ActiveCustomer = new Customer()
        {
            CustomerNumber = resellerId.Trim('0')
        };

        return retUser;
    }

    private async Task<User> GetUserInfoAsync(string userId)
    {
        var response = await GetImpersonatedUserDataAsync(userId).ConfigureAwait(false);

        if (!response.IsError) 
        {
            var retUser = response.User;
            if (retUser != null)
                retUser.ID = userId;
            return retUser;
        }
        if (response.ErrorCode == "exception")
        {
            _logger.LogError("Getting data via impersonation caused exception:  {response.ErrorDescription}", response.ErrorDescription);
        }

        _logger.LogInformation("Getting data via impersonation failed. UserId: {userId.Substring(0, 6)}****** ", userId.Substring(0, 6));

        return null;

    }

    private async Task<ValidateUserResponseModel> GetImpersonatedUserDataAsync(string userId)
    {
        var request = new ValidateImpersonatedUserRequest()
        {
            SecurityServiceHost = _userServiceAddress,
            ImpersonatedUserId = userId
        };

        ValidateUserResponseModel response;
        try
        {
            response = await _httpClient
                .GetAsync<ValidateUserResponseModel>(
                    request.SecurityServiceHost.AppendPathSegment("GetImpersonatedUser"),
                    new[] { request.ImpersonatedUserId })
                .ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            return SecurityResponse.FromException<ValidateUserResponseModel>(ex);
        }

        return response;
    }

    private async Task<Customer> GetImpersonatedUserCustomerAsync(string impersonatedUserCustomerId)
    {
        var request = new ValidateImpersonatedUserAccountRequestModel()
        {
            SecurityServiceHost = _userServiceAddress,
            ImpersonatedAccountId = impersonatedUserCustomerId
        };

        var response = await GetUserAccountAsync(request).ConfigureAwait(false);

        if (response.IsError)
        {
            if (response.ErrorCode == "exception")
            {
                _logger.LogError("Impersonation Exception:  {response.ErrorDescription}", response.ErrorDescription);
            }

            _logger.LogInformation("Impersonation Failed:  Impersonation validation failed.");

            return null;
        }

        return response.User.ActiveCustomer;
    }

    private Task<ValidateUserResponseModel> GetUserAccountAsync(ValidateImpersonatedUserAccountRequestModel request)
    {
        throw new NotImplementedException();
    }
}