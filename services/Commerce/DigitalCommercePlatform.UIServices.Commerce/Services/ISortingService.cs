//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface ISortingService
    {
        bool IsPropertyValid(string sortingValue);
        bool IsSortingDirectionValid(string sortingValue);
        string GetValidProperties();
        string GetValidSortingValues();
        string GetSortingPropertyValue(string sortingValue);
        bool IsSortingDirectionAscending(string sortingValue);
    }
}
