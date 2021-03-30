using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Search
{
	[ExcludeFromCodeCoverage]
	public class MaterialTypeAheadResponse
	{
		public bool HasResults { get { return Suggestions?.Length > 0; } } 
		public MaterialTypeAheadSuggestion[] Suggestions { get; set; }
	}
	[ExcludeFromCodeCoverage]
	public class MaterialTypeAheadSuggestion
	{
		public string ManufacturerNumber { get; set; }
		public string Name { get; set; }
		public string Category { get; set; }
		public string MaterialNumber { get; set; }
	}
}
