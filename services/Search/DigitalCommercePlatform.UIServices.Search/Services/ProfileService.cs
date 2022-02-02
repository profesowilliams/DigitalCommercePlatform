//2022 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.Profile;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Services.Providers.Profile;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface IProfileService
    {
        SearchProfileModel GetSearchProfile(SearchProfileId profileId);
        CultureProfileModel GetCultureProfile(SearchProfileId profileId);
        void SaveSearchProfile(SearchProfileModel profile, SearchProfileId profileId);
    }

    public class ProfileService : IProfileService
    {
        private readonly IProfileProvider _profileProvider;
        private readonly IMapper _mapper;
        private SearchProfileModel _profile;
        private CultureProfileModel _cultureProfile;
        private const string ProfileName = "UI.Search.Profile";
        private const string CultureProfileName = "UI.Profile";

        public ProfileService(IProfileProvider profileProvider, IMapper mapper)
        {
            _profileProvider = profileProvider;
            _mapper = mapper;
        }

        public SearchProfileModel GetSearchProfile(SearchProfileId profileId)
        {
            //its scoped register service. so should call for profile  only once per request.
            //no need to call for the same profile each time
            if (_profile is not null)
                return _profile;

            try
            {
                var dto = _profileProvider.GetProfile<SearchProfileDto>(profileId.Account, profileId.UserId, ProfileName);
                _profile = _mapper.Map<SearchProfileModel>(dto);

                return _profile;
            }
            catch (RemoteServerHttpException ex) when (ex.Code == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public void SaveSearchProfile(SearchProfileModel profile, SearchProfileId profileId)
        {
            var dto = _mapper.Map<SearchProfileDto>(profile);
            _profileProvider.CreateUserProfile(profileId.Account, profileId.UserId, ProfileName, dto); //create method in profile service is upsert method
        }

        public CultureProfileModel GetCultureProfile(SearchProfileId profileId)
        {
            if (_cultureProfile is not null)
                return _cultureProfile;

            try
            {
                var dto = _profileProvider.GetProfile<CultureProfileDto>(profileId?.Account, profileId?.UserId, CultureProfileName);
                _cultureProfile = _mapper.Map<CultureProfileModel>(dto);

                return _cultureProfile;
            }
            catch (RemoteServerHttpException ex) when (ex.Code == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }
    }
}