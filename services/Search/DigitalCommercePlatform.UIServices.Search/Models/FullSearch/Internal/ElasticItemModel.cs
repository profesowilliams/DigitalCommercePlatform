//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class ElasticItemModel
    {
        public string System { get; set; }
        public string Id { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string Upc { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public bool IsSelectedForCompare { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsExactMatch { get; set; }
        public StockModel Stock { get; set; }
        public List<ProductNoteModel> ProductNotes { get; set; }
        public PriceModel Price { get; set; }
        public List<ImageModel> ProductImages { get; set; }
        public List<MainSpecificationModel> MainSpecifications { get; set; }
        public List<PlantModel> Plants { get; set; }
    }
}
