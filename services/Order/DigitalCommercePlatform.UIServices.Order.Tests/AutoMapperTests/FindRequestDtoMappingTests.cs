using DigitalCommercePlatform.UIService.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIService.Order.Enums;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.AutoMapperTests
{
    public class FindRequestDtoMappingTests : MappingTests
    {
        [Trait("Category", "GetObject")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map FindModel")]
        [MemberData(nameof(GetModel))]
        public void FindRequestDtoMapTest(FindRequestModel source)
        {
            var target = mapper.Map<FindRequestDto>(source);

            target.Should().NotBeNull().And.BeAssignableTo<FindRequestDto>();
        }

        public static TheoryData<FindRequestModel> GetModel()
        {
            return new TheoryData<FindRequestModel>()
            {
                new FindRequestModel
                {
                    ID = "10909",
                    CreatedFrom = new DateTime(2021, 1, 12),
                    CreatedBy = "Tester",
                    CreatedTo = new DateTime(2021, 1, 18),
                    ContractNumber = "23",
                    CustomerID = "851",
                    Status = Status.PROCESSING,
                    Revenue = (decimal?)19078.78,
                    TeamIds = new string[] {"1", "2", "3" },
                    VendorSolutionAssociate = null,
                    VendorSolutionRepresentative = Array.Empty<int>(),
                    TDOSSearchable = true,
                    WithPaginationInfo = false
                }
            };
        }
    }
}