using System.Collections.Generic;
using DigitalCommercePlatform.UIService.Browse.Models.Catalogue;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails
{
    public class GetCatalogueResponse
    {
        public IEnumerable<CatalogHierarchyModel> CatalogHierarchies { get; set; }
    }
}
