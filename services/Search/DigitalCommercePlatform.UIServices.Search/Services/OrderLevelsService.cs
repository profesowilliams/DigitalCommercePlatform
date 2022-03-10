//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalFoundation.Common.Providers.Settings;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface IOrderLevelsService
    {
        string GetOrderLevel(SearchProfileId profileId);
        List<DropdownElementModel<string>> GetOrderLevelOptions(SearchProfileId profileId, string selectedLevelId = null);
    }

    public class OrderLevelsService : IOrderLevelsService
    {
        private readonly ITranslationService _translationService;
        private readonly IProfileService _profileService;
        private readonly List<DropdownElementModel<string>> _siteSettingsOrderLevels;
        public const string OrderLevelsName = "Search.UI.OrderLevels";

        public OrderLevelsService(ITranslationService translationService, IProfileService profileService, ISiteSettings siteSettings)
        {
            _translationService = translationService ?? throw new ArgumentNullException(nameof(translationService));
            _profileService = profileService ?? throw new ArgumentNullException(nameof(profileService));
            
            if (siteSettings == null) { throw new ArgumentNullException(nameof(siteSettings)); }
            
            _siteSettingsOrderLevels = siteSettings.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsName);

            if (_siteSettingsOrderLevels is null || !_siteSettingsOrderLevels.Any())
            {
                throw new ArgumentException("Search.UI.OrderLevels site settings collection can not be empty");
            }

            if (_siteSettingsOrderLevels.Count(i => i.Selected) != 1)
            {
                throw new ArgumentException("Search.UI.OrderLevels site settings collection must have one element marked as Selected equals True");
            }

            if (_siteSettingsOrderLevels.Any(i => string.IsNullOrWhiteSpace(i.Id)))
            {
                throw new ArgumentException("Search.UI.OrderLevels site settings collection must have all elements with specified Id");
            }
        }

        public string GetOrderLevel(SearchProfileId profileId)
        {
            if (profileId is not null && profileId.HasValue)
            {
                var searchProfile = _profileService.GetSearchProfile(profileId);
                if (!string.IsNullOrWhiteSpace(searchProfile?.DefaultPricingOption))
                {
                    return searchProfile.DefaultPricingOption;
                }
            }

            var defaultLevel = _siteSettingsOrderLevels.Where(i => i.Selected == true).Single();
            return defaultLevel.Id;
        }

        public List<DropdownElementModel<string>> GetOrderLevelOptions(SearchProfileId profileId, string selectedLevelId = null)
        {
            Dictionary<string, string> orderLevelsTranslations = null;
            _translationService.FetchTranslations(OrderLevelsName, ref orderLevelsTranslations);

            var translatedOrderLevels = _siteSettingsOrderLevels.Select(i => new DropdownElementModel<string>
            {
                Name = _translationService.Translate(orderLevelsTranslations, i.Id),
                Id = i.Id,
                Selected = i.Selected
            }).ToList();

            if (!string.IsNullOrWhiteSpace(selectedLevelId))
            {
                translatedOrderLevels.ForEach(i => i.Selected = selectedLevelId.Equals(i.Id, StringComparison.OrdinalIgnoreCase));
                return translatedOrderLevels;
            }

            if (profileId is null || !profileId.HasValue)
            {
                return translatedOrderLevels;
            }

            var searchProfile = _profileService.GetSearchProfile(profileId);

            if (string.IsNullOrWhiteSpace(searchProfile?.DefaultPricingOption))
            {
                return translatedOrderLevels;
            }

            translatedOrderLevels.ForEach(i => i.Selected = searchProfile.DefaultPricingOption.Equals(i.Id, StringComparison.OrdinalIgnoreCase));

            return translatedOrderLevels;
        }
    }
}
