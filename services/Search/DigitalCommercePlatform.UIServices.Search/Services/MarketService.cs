//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Models.Profile;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface IMarketService
    {
        string[] GetMarkets(SearchProfileId searchProfileId);
    }

    public class MarketService : IMarketService
    {
        private readonly IProfileService _profileService;

        public MarketService(IProfileService profileService)
        {
            _profileService = profileService;
        }

        public string[] GetMarkets(SearchProfileId searchProfileId)
        {
            var markets = new string[] { "ALL" };

            if (searchProfileId is null || !searchProfileId.HasValue)
                return markets;

            var profile = _profileService.GetSearchProfile(searchProfileId);

            if (string.IsNullOrWhiteSpace(profile?.DefaultMarketOption))
                return markets;

            markets = profile.DefaultMarketOption.Split(',');

            return markets;
        }
    }
}