//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Profile;
using DigitalCommercePlatform.UIServices.Browse.Models;
using DigitalFoundation.Common.Providers.Settings;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IOrderLevelsService
    {
        (List<DropdownElementModel<string>> orderLevelsOptions, string selectedOrderLevel) GetOrderLevels(string preferredOrderLevel = null);
    }

    public class OrderLevelsService : IOrderLevelsService
    {
        private readonly ITranslationService _translationService;
        private readonly IProfileService<OrderLevelDto> _profileService;

        private readonly List<DropdownElementModel<string>> _siteSettingsOrderLevels;

        public const string OrderLevelsName = "Browse.UI.OrderLevels";
        public const string ProfileName = "UI.Browse.Profile";

        public OrderLevelsService(ITranslationService translationService, IProfileService<OrderLevelDto> profileService, ISiteSettings siteSettings)
        {
            _translationService = translationService ?? throw new ArgumentNullException(nameof(translationService));
            _profileService = profileService ?? throw new ArgumentNullException(nameof(profileService));

            if (siteSettings == null) { throw new ArgumentNullException(nameof(siteSettings)); }

            _siteSettingsOrderLevels = siteSettings.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsName);

            if (_siteSettingsOrderLevels is null || !_siteSettingsOrderLevels.Any())
            {
                throw new ArgumentException("Browse.UI.OrderLevels site settings collection can not be empty");
            }

            if (_siteSettingsOrderLevels.Count(i => i.Selected) != 1)
            {
                throw new ArgumentException("Browse.UI.OrderLevels site settings collection must have one element marked as Selected equals True");
            }

            if (_siteSettingsOrderLevels.Any(i => string.IsNullOrWhiteSpace(i.Id)))
            {
                throw new ArgumentException("Browse.UI.OrderLevels site settings collection must have all elements with specified Id");
            }
        }

        public (List<DropdownElementModel<string>> orderLevelsOptions, string selectedOrderLevel) GetOrderLevels(string preferredOrderLevel = null)
        {
            if (IsNotValid(preferredOrderLevel))
            {
                return (null, preferredOrderLevel);
            }

            Dictionary<string, string> orderLevelsTranslations = null;
            _translationService.FetchTranslations(OrderLevelsName, ref orderLevelsTranslations);

            var translatedOrderLevels = _siteSettingsOrderLevels.Select(i => new DropdownElementModel<string>
            {
                Name = _translationService.Translate(orderLevelsTranslations, i.Id),
                Id = i.Id,
                Selected = i.Selected
            }).ToList();

            if (!string.IsNullOrWhiteSpace(preferredOrderLevel))
            {
                return GetSelected(translatedOrderLevels, preferredOrderLevel);
            }

            var profileOrderLevel = _profileService.Get(ProfileName);

            if (!string.IsNullOrWhiteSpace(profileOrderLevel?.DefaultPricingOption))
            {
                return GetSelected(translatedOrderLevels, profileOrderLevel.DefaultPricingOption);
            }

            return (translatedOrderLevels, translatedOrderLevels.Single(i => i.Selected).Id);
        }

        private bool IsNotValid(string preferredLevelId)
        {
            return !string.IsNullOrWhiteSpace(preferredLevelId) && !_siteSettingsOrderLevels.Any(i => i.Id.Equals(preferredLevelId, StringComparison.OrdinalIgnoreCase));
        }

        private static (List<DropdownElementModel<string>> orderLevelsOptions, string selectedOrderLevel) GetSelected(List<DropdownElementModel<string>> orderLevels, string itemToSelect)
        {
            var orderLevelsOptionsWithSelectedLevel = orderLevels.Select(i => new DropdownElementModel<string>
            {
                Id = i.Id,
                Name = i.Name,
                Selected = itemToSelect.Equals(i.Id, StringComparison.OrdinalIgnoreCase)
            }).ToList();

            return (orderLevelsOptionsWithSelectedLevel, orderLevelsOptionsWithSelectedLevel.Single(i => i.Selected).Id);
        }
    }
}
