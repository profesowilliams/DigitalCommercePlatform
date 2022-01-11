//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Profile
{
    public class Save
    {
        public class Request : INotification
        {
            public Request(SearchProfileId profileId, SearchProfileModel profile)
            {
                ProfileId = profileId;
                Profile = profile;
            }

            public SearchProfileId ProfileId { get; set; }
            public SearchProfileModel Profile { get; set; }
        }

        public class Handler : INotificationHandler<Request>
        {
            private readonly IProfileService _profileService;

            public Handler(IProfileService profileService)
            {
                _profileService = profileService;
            }

            public Task Handle(Request notification, CancellationToken cancellationToken)
            {
                _profileService.SaveSearchProfile(notification.Profile, notification.ProfileId);

                return Task.CompletedTask;
            }
        }
    }
}