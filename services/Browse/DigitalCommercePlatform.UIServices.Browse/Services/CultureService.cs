//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Providers.Settings;
using System.Globalization;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICultureService
    {
        public void Process(string culture);
    }

    public class CultureService : ICultureService
    {
        public const string DefaultCultureSiteSettingName = "UI.DefaultCulture";
        public const string ProfileName = "UI.Profile";
        private readonly IProfileService _profile;
        private readonly ISiteSettings _siteSettings;

        public CultureService(IProfileService profile, ISiteSettings siteSettings)
        {
            _profile = profile;
            _siteSettings = siteSettings;
        }

        public void Process(string culture)
        {
            var cultureToSet = GetCulture(culture);
            SetCulture(cultureToSet);
        }

        private string GetCulture(string culture)
        {
            var dto = _profile.Get(ProfileName);
            var result = culture;

            if (dto == null || string.IsNullOrWhiteSpace(dto.Culture))
            {
                var defaultCulture = _siteSettings.TryGetSetting(DefaultCultureSiteSettingName);
                if (!string.IsNullOrWhiteSpace(defaultCulture))
                {
                    result = defaultCulture;
                }
            }
            else
            {
                result = dto.Culture;
            }

            return result;
        }

        private void SetCulture(string culture)
        {
            CultureInfo.CurrentCulture = new CultureInfo(culture);
        }
    }
}