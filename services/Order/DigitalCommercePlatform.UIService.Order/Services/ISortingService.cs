namespace DigitalCommercePlatform.UIService.Order.Services
{
    public interface ISortingService
    {
        bool IsPropertyValid(string sortingValue);
        string GetValidProperties();
        (string sortingProperty, bool sortAscending) GetSortingParameters(string sortingValue);
    }
}
