using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Catalogue.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public class CatalogueEndPointsOptions
    {
        public const string CatalogueEndPoints = "CatalogueEndPoints";
        public string Validate { get; set; }
    }
}
