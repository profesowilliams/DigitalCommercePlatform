using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Catalog.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public class CatalogEndPointsOptions
    {
        public const string CatalogEndPoints = "CatalogEndPoints";
        public string Validate { get; set; }
    }
}
