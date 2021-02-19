using DigitalCommercePlatform.UIServices.Product.Dto.Summary.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Dto.Summary
{
    [ExcludeFromCodeCoverage]
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