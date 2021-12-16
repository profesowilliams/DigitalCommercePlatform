//2021 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalFoundation.Common.Providers.Settings;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface ISortService
    {
        SortRequestDto GetDefaultSortDto();

        IEnumerable<DropdownElementModel> GetDefaultSortingOptions();

        IEnumerable<DropdownElementModel> GetSortingOptionsBasedOnRequest(SortRequestModel sort);
    }

    public class SortService : ISortService
    {
        private readonly List<DropdownElementModel> _sortingOptions;

        public SortService(ISiteSettings siteSettings, ITranslationService translationService)
        {
            Dictionary<string, string> translations = null;
            translationService.FetchTranslations("Search.UI.SortingOptions", ref translations);

            _sortingOptions = siteSettings.GetSetting<List<DropdownElementModel>>("Search.UI.SortingOptions");

            _sortingOptions = _sortingOptions.Select(x =>
           {
               x.Name = translationService.Translate(translations, x.Id);
               return x;
           }).ToList();
        }

        public SortRequestDto GetDefaultSortDto()
        {
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

        public IEnumerable<DropdownElementModel> GetDefaultSortingOptions() => _sortingOptions;

        public IEnumerable<DropdownElementModel> GetSortingOptionsBasedOnRequest(SortRequestModel sort)
        {
            if (sort is null)
                return _sortingOptions;

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