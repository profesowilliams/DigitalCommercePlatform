//2022 (c) Tech Data Corporation - All Rights Reserved.

namespace DigitalCommercePlatform.UIServices.Search.Dto.Profile
{
    public class SearchProfileDto
    {
        public string DefaultSortOption { get; set; }
        public string DefaultPricingOption { get; set; }
        public string DefaultMarketOption { get; set; }
        public bool NewStatusCode { get; set; }
        public bool ActiveStatusCode { get; set; }
        public bool AllocatedStatusCode { get; set; }
        public bool PhasedOutStatusCode { get; set; }
    }
}