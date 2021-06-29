using DigitalCommercePlatform.UIServices.Account.Models.Quote.Internal;

namespace DigitalCommercePlatform.UIServices.Account.Models.Quotes
{
    public class QuoteModel
    {
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
        public string CurrencySymbol { get; set; } = "$";
        public ResellerModel Reseller { get; set; }
        public ShipToModel ShipTo { get; set; }
        public EndUserModel EndUser { get; set; }
    }

    public class FindResponse<T>
    {
        public T Data { get; set; }
    }
}
