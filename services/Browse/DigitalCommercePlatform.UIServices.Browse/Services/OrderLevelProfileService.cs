//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Profile;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Services.Providers.Profile;
using System;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public class OrderLevelProfileService : IProfileService<OrderLevelDto>
    {
        private readonly IContext _context;
        private readonly IProfileProvider _profileProvider;
        private OrderLevelDto _orderLevel;

        public OrderLevelProfileService(IContext context, IProfileProvider profileProvider)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _profileProvider = profileProvider ?? throw new ArgumentNullException(nameof(profileProvider));
        }

        public OrderLevelDto Get(string profileName)
        {
            if (string.IsNullOrWhiteSpace(profileName))
            {
                throw new ArgumentNullException(nameof(profileName));
            }

            if (string.IsNullOrWhiteSpace(_context.User?.ActiveCustomer?.CustomerNumber) || string.IsNullOrWhiteSpace(_context.User?.ID))
            {
                return null;
            }

            if (_orderLevel is null)
            {
                _orderLevel = _profileProvider.GetProfile<OrderLevelDto>(_context.User.ActiveCustomer.CustomerNumber, _context.User.ID, profileName);
            }

            return _orderLevel;
        }
    }
}
