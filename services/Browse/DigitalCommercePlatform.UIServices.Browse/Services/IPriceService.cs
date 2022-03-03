//2022 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IPriceService
    {
        string GetListPrice(decimal? listPrice, string naLabel, bool listPriceAvailable);
    }
}
