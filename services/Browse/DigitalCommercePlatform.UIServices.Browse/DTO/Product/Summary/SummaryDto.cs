using DigitalCommercePlatform.UIService.Browse.DTO.Product.Summary.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Summary
{
    public class SummaryDto
    {
        public SourceDto Source { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string shortDescription { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public IEnumerable<PlantDto> Plants { get; set; }
        public IEnumerable<SalesOrganizationDto> SalesOrganizations { get; set; }
    }
}