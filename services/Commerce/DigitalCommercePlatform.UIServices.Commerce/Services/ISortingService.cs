namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface ISortingService
    {
        bool IsPropertyValid(string sortingValue);
        string GetValidProperties();
        (string sortingProperty, bool sortAscending) GetSortingParameters(string sortingValue);
    }
}
