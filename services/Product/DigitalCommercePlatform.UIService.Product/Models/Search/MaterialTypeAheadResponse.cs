namespace DigitalCommercePlatform.UIService.Product.Models.Search
{
    public class MaterialTypeAheadResponse
	{
		public bool HasResults { get { return Suggestions?.Length > 0; } } 
		public MaterialTypeAheadSuggestion[] Suggestions { get; set; }
	}
	public class MaterialTypeAheadSuggestion
	{
		public string ManufacturerNumber { get; set; }
		public string Name { get; set; }
		public string Category { get; set; }
		public string MaterialNumber { get; set; }
	}
}
