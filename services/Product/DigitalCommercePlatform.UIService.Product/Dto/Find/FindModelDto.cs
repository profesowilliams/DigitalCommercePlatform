using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Dto.Find
{
    [ExcludeFromCodeCoverage]
    public class FindModelDto
    {
        public bool Details { get; set; }
        public string[] MaterialNumber { get; set; }
        public string[] OldMaterialNumber { get; set; }
        public string[] Manufacturer { get; set; }
        public string[] MfrPartNumber { get; set; }
        public string[] UPC { get; set; }
        public string CustomerNumber { get; set; }
        public string CustomerPartNumber { get; set; }
        public string SalesOrganization { get; set; }
        public string[] MaterialStatus { get; set; }
        public string[] Territories { get; set; }
        public string Description { get; set; }
        public string System { get; set; }
        public int? Page { get; set; }
        public int? PageSize { get; set; }
        public Sort SortBy { get; set; }
        public bool SortAscending { get; set; }
        public ComparisonOperator ComparisonOperator { get; set; }
    }
    public enum ComparisonOperator
    {
        Equals,
        StartsWith
    }

    public enum Sort
    {
        ID,
        Name
    }
}