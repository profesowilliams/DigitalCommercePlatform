namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ISortingService
    {
        bool IsPropertyValid(string sortingValue);
        string GetValidProperties();
        string GetSortingProperty(string sortingValue);
    }
}
