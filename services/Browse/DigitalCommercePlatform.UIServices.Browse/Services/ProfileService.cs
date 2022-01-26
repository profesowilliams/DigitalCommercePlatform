//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Profile;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Services.Providers.Profile;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IProfileService
    {
        public CultureDto Get(string profileName);
    }

    public class ProfileService : IProfileService
    {
        private readonly IContext _context;
        private readonly IProfileProvider _profileProvider;
        private CultureDto _culture;

        public ProfileService(IContext context, IProfileProvider profileProvider)
        {
            _context = context;
            _profileProvider = profileProvider;
        }

        public CultureDto Get(string profileName)
        {
            if (_culture == null)
            {
                _culture = _profileProvider.GetProfile<CultureDto>(
                _context.User.ActiveCustomer.CustomerNumber,
                _context.User.ID,
                profileName);
            }
            return _culture;
        }
    }
}