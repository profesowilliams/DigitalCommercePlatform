//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalFoundation.Common.Providers.Settings;
using System.Globalization;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface ICultureService
    {
        public void SetCurrentCultureFor(SearchProfileId searchProfileId, string culture);
    }

    public class CultureService : ICultureService
    {
        public const string DefaultCultureSiteSettingName = "UI.DefaultCulture";
        private readonly IProfileService _profile;
        private readonly ISiteSettings _siteSettings;

        public CultureService(IProfileService profile, ISiteSettings siteSettings)
        {
            _profile = profile;
            _siteSettings = siteSettings;
        }

        public void SetCurrentCultureFor(SearchProfileId searchProfileId, string culture)
        {
            var selectedCulture = GetCulture(culture, searchProfileId);
            CultureInfo.CurrentCulture = new CultureInfo(selectedCulture);
        }

        private string GetCulture(string defaultCulture, SearchProfileId searchProfileId)
        {
            if(searchProfileId != null && searchProfileId.HasValue)
            {
                var profileCulture = _profile.GetCultureProfile(searchProfileId);

                if (profileCulture != null && !string.IsNullOrWhiteSpace(profileCulture.Culture))
                {
                    return profileCulture.Culture;
                }
            }

            var siteSettingsCulture = _siteSettings.TryGetSetting(DefaultCultureSiteSettingName);

            if (!string.IsNullOrWhiteSpace(siteSettingsCulture))
            {
                return siteSettingsCulture;
            }

            return defaultCulture;
        }
    }
}
