//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalFoundation.Common.Providers.Settings;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface ISortService
    {
        SortRequestDto GetDefaultSortDto(SearchProfileId profileId);

        IEnumerable<DropdownElementModel<string>> GetDefaultSortingOptions(SearchProfileId profileId);

        IEnumerable<DropdownElementModel<string>> GetSortingOptionsBasedOnRequest(SortRequestModel sort, SearchProfileId profileId);
    }

    public class SortService : ISortService
    {
        private readonly List<DropdownElementModel<string>> _sortingOptions;
        private readonly IProfileService _profileService;

        public SortService(ISiteSettings siteSettings, ITranslationService translationService, IProfileService profileService)
        {
            Dictionary<string, string> translations = null;
            translationService.FetchTranslations("Search.UI.SortingOptions", ref translations);

            _sortingOptions = siteSettings.GetSetting<List<DropdownElementModel<string>>>("Search.UI.SortingOptions");

            _sortingOptions = _sortingOptions.Select(x =>
           {
               x.Name = translationService.Translate(translations, x.Id);
               return x;
           }).ToList();
            _profileService = profileService;
        }

        public SortRequestDto GetDefaultSortDto(SearchProfileId profileId)
        {
            SetSortingOptionsBasedOnprofile(profileId);

            var defaultSort = _sortingOptions.FirstOrDefault(x => x.Selected);

            if (defaultSort is null)
                return null;

            var splitted = defaultSort.Id.Split('.');

            var type = splitted.ElementAtOrDefault(0);
            _ = bool.TryParse(splitted.ElementAtOrDefault(1) ?? string.Empty, out bool direction);

            return new SortRequestDto
            {
                Type = type,
                Direction = direction
            };
        }

        private void SetSortingOptionsBasedOnprofile(SearchProfileId profileId)
        {
            if (profileId is null || !profileId.HasValue)
                return;

            var searchProfile = _profileService.GetSearchProfile(profileId);
            if (searchProfile is null)
                return;

            var selectedOption = _sortingOptions.FirstOrDefault(x => x.Id.Equals(searchProfile.DefaultSortOption, StringComparison.InvariantCultureIgnoreCase));

            if (selectedOption is null)
                return;

            _sortingOptions.ForEach(x => x.Selected = x.Id == selectedOption.Id);
        }

        public IEnumerable<DropdownElementModel<string>> GetDefaultSortingOptions(SearchProfileId profileId)
        {
            SetSortingOptionsBasedOnprofile(profileId);
            return _sortingOptions;
        }

        public IEnumerable<DropdownElementModel<string>> GetSortingOptionsBasedOnRequest(SortRequestModel sort, SearchProfileId profileId)
        {
            if (sort is null)
            {
                SetSortingOptionsBasedOnprofile(profileId);
                return _sortingOptions;
            }

            var type = sort.Type;
            var direction = sort.Direction;

            string sortingId = GetSortingId(type, direction);

            return _sortingOptions.Select(x =>
            {
                x.Selected = sortingId is null ? x.Selected : sortingId.StartsWith(x.Id, StringComparison.InvariantCultureIgnoreCase);

                return x;
            });
        }

        private static string GetSortingId(string type, bool direction)
        {
            if (string.IsNullOrWhiteSpace(type))
                return null;

            return $"{type}.{direction}";
        }
    }
}