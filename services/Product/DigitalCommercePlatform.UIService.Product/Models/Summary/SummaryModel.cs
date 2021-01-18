using DigitalCommercePlatform.UIService.Product.Models.Summary.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Models.Summary
{
    public class SummaryModel
    {
        public SourceModel Source { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string shortDescription { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public IEnumerable<PlantModel> Plants { get; set; }
        public IEnumerable<SalesOrganizationModel> SalesOrganizations { get; set; }
    }
}