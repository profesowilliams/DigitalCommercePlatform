//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalFoundation.Common.Providers.Settings;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface IItemsPerPageService
    {
        int GetDefaultItemsPerPage();

        IEnumerable<DropdownElementModel<int>> GetDefaultItemsPerPageOptions();

        IEnumerable<DropdownElementModel<int>> GetItemsPerPageOptionsBasedOnRequest(int pageSize);
    }

    public class ItemsPerPageService : IItemsPerPageService
    {
        private readonly List<DropdownElementModel<int>> _itemsPerPageOptions;

        public ItemsPerPageService(ISiteSettings siteSettings)
        {
            _itemsPerPageOptions = siteSettings.GetSetting<List<DropdownElementModel<int>>>("Search.UI.ItemsPerPageOptions");
        }

        public int GetDefaultItemsPerPage() => _itemsPerPageOptions.First(x => x.Selected).Id;

        public IEnumerable<DropdownElementModel<int>> GetDefaultItemsPerPageOptions() => _itemsPerPageOptions;

        public IEnumerable<DropdownElementModel<int>> GetItemsPerPageOptionsBasedOnRequest(int pageSize)
            => _itemsPerPageOptions.Select(x => { x.Selected = x.Id == pageSize; return x; });
    }
}