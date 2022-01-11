//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Profile
{
    public class Get
    {
        public class Request : IRequest<SearchProfileModel>
        {
            public SearchProfileId ProfileId { get; set; }

            public Request(SearchProfileId profileId)
            {
                ProfileId = profileId;
            }
        }

        public class Handler : IRequestHandler<Request, SearchProfileModel>
        {
            private readonly IProfileService _profileService;

            public Handler(IProfileService profileService)
            {
                _profileService = profileService;
            }

            public Task<SearchProfileModel> Handle(Request request, CancellationToken cancellationToken)
            {
                return Task.FromResult(_profileService.GetSearchProfile(request.ProfileId));
            }
        }
    }
}