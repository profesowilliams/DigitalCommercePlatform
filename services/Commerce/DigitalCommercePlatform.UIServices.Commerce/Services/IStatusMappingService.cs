//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IStatusMappingService
    {
        string GetMappingPropertyValue(string mappingValue);
        bool IsStatusValid(string statusValue);
        string GetValidStatusValues();
    }
}
