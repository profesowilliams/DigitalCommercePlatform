using System.Collections.Generic;
using DigitalCommercePlatform.UIService.Browse.Models.Catalogue;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    public class GetHeaderResponse 
    {
        public string UserId { get; set; } 
        public string UserName { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CartId { get; set; }
        public int CartItemCount { get; set; }
        public List<CatalogHierarchyModel> CatalogHierarchies { get; set; }

    }
}
