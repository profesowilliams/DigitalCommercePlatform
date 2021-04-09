namespace DigitalCommercePlatform.UIServices.Order.Services.Contracts
{
    public interface ISortingService
    {
        bool IsPropertyValid(string sortingValue);
        string GetValidProperties();
        (string sortingProperty, bool sortAscending) GetSortingParameters(string sortingValue);
    }
}
