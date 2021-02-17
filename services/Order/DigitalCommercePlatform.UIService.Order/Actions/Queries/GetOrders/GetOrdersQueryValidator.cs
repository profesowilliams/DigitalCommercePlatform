using DigitalCommercePlatform.UIService.Order.Services.Contracts;
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
            RuleFor(i => i.PageSize).GreaterThan(0).WithMessage("Page Size must be greater than 0.");
            RuleFor(i => i.PageNumber).GreaterThanOrEqualTo(0).WithMessage("PageNumber must be greater than or equal to 0.");
        }

        private bool IsPropertyValidForSorting(string propertyValue)
        {
            return _sortingService.IsPropertyValid(propertyValue);
        }
    }
}
