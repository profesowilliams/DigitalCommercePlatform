namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    public class FindResponse<T>
    {
        public long? Count { get; set; }
        public T Data { get; set; }
    }
}
