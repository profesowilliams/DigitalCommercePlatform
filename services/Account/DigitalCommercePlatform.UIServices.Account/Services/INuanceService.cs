//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using DigitalFoundation.Common.Features.Contexts.Constants;
using DigitalFoundation.Common.Features.Contexts.Models.Nuance;
using System.Security.Claims;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface INuanceService
    {
        SignedNuanceUser GetUserData(ClaimsPrincipal user);
    }

    public class NuanceService : INuanceService
    {
        private readonly INuanceUserObjectBuilder _nuanceUserObjectBuilder;

        public NuanceService(INuanceUserObjectBuilder nuanceUserObjectBuilder)
        {
            _nuanceUserObjectBuilder = nuanceUserObjectBuilder;
        }

        public SignedNuanceUser GetUserData(ClaimsPrincipal user)
        {
            var nuanceUser = new NuanceUser()
            {
                ECID = user.FindFirstValue(UserClaimTypes.ID),
                FirstName = user.FindFirstValue(UserClaimTypes.FirstName),
                LastName = user.FindFirstValue(UserClaimTypes.LastName),
                ResellerID = user.FindFirstValue(UserClaimTypes.ActiveCustomer)
            };

            var signedNuanceUserObject = _nuanceUserObjectBuilder.Build(nuanceUser);
            return signedNuanceUserObject;
        }
    }
}