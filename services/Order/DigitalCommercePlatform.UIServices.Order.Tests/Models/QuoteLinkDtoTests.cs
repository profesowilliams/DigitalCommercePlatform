using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.Models
{
    public class QuoteLinkDtoTests
    {
        private readonly QuoteLinkDto _source;

        public QuoteLinkDtoTests()
        {
            _source = new QuoteLinkDto
            {
                Group = "Group",
                ID = "45",
                Request = "Request",
                Revision = "Revision",
                SalesOrg = "AB",
                SubRevision = "Subrevision",
                System = "App.Order",
                TargetSystem = "App.Quote"
            };
        }

        [Theory]
        [InlineData("Group", "45", "Request", "Revision", "AB", "Subrevision", "App.Order", "App.Quote")]
        public void QuoteLinkDtoEqualsTest(string group,
            string id,
            string request,
            string revision,
            string sales,
            string subrevision,
            string system,
            string targetsystem)
        {
            var target = new QuoteLinkDto
            {
                Revision = revision,
                Group = group,
                SubRevision = subrevision,
                TargetSystem = targetsystem,
                SalesOrg = sales,
                System = system,
                ID = id,
                Request = request
            };

            _source.Equals(target).Should().BeTrue();
        }
    }
}