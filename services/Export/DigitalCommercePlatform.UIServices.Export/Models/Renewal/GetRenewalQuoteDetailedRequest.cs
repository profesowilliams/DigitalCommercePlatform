//2022 (c) Tech Data Corporation -. All Rights Reserved.

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal
{
    public class GetRenewalQuoteDetailedRequest
    {
        public string[] Id { get; set; }
        public string Type { get; set; }
        public bool Details { get; set; } = true;
    }
}
