using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalFoundation.Common.Models;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Models.Common
{
    public class PaginatedResponseTests
    {
        internal class CreationShouldSetAllPublicPropertiesData : TheoryData<FindResponse<object>, IPaginated, long?>
        {
            public CreationShouldSetAllPublicPropertiesData()
            {
                Add(null, new Paginated { PageNumber = 0, PageSize = 0 }, null);
                Add(new FindResponse<object>
                {
                    Count = null,
                    Data = null
                }, new Paginated { PageNumber = 1, PageSize = 10 }, null);
                Add(new FindResponse<object>
                {
                    Count = 0,
                    Data = CreateObjectsList(0)
                }, new Paginated { PageNumber = 1, PageSize = 10 }, 0);
                Add(new FindResponse<object>
                {
                    Count = 5,
                    Data = CreateObjectsList(5)
                }, new Paginated { PageNumber = 1, PageSize = 6 }, 1);
                Add(new FindResponse<object>
                {
                    Count = 11,
                    Data = CreateObjectsList(5)
                }, new Paginated { PageNumber = 1, PageSize = 5 }, 3);
            }

            private static IEnumerable<object> CreateObjectsList(int count)
            {
                var result = new List<object>(count);
                for (int i = 0; i < count; i++)
                    result.Add(new object());
                return result;
            }

        }

        [Theory]
        [ClassData(typeof(CreationShouldSetAllPublicPropertiesData))]
        public void CreationShouldSetAllPublicProperties(FindResponse<object> findResponse,
                                                         IPaginated paginated,
                                                         long? expectedPageCount)
        {
            var result = new PaginatedResponse<object>(findResponse, paginated);

            result.PageCount.Should().Be(expectedPageCount);
            result.PageNumber.Should().Be(paginated.PageNumber);
            result.PageSize.Should().Be(paginated.PageSize);
            result.TotalItems.Should().Be(findResponse?.Count);
        }
    }
}
