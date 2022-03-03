//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Helpers;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public class PriceService : IPriceService
    {
        public string GetListPrice(decimal? listPrice, string naLabel, bool listPriceAvailable)
        {
            if (listPrice.HasValue && listPrice != 0)
                return listPrice.Value.Format();

            return listPriceAvailable ? 0m.Format() : naLabel;
        }
    }
}
