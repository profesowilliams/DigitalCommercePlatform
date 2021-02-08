using DigitalCommercePlatform.UIService.Order.Services;
using FluentValidation;
using System;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders
{
    public class GetOrdersQueryValidator : AbstractValidator<GetOrdersQuery>
    {
        private readonly ISortingService _sortingService;
        
        public GetOrdersQueryValidator(ISortingService sortingService)
        {
            _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));
            
            var validProperties = _sortingService.GetValidProperties();
            RuleFor(i => i.OrderBy).Must(IsPropertyValidForSorting).WithMessage(i => $"You can't sort by {i.OrderBy} property. Valid properties are: {validProperties}");
        }

        private bool IsPropertyValidForSorting(string propertyValue)
        {
            return _sortingService.IsPropertyValid(propertyValue);
        }
    }
}
