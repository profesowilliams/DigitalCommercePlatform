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

        [Trait("Category", "Model Test")]
        [Theory(DisplayName = "QuoteLinkDto Equals Test")]
        [InlineData("Group", "45", "Request", "Revision", "AB", "Subrevision", "App.Order", "App.Quote", true, "")]
        [InlineData("Group", "5", "Request", "Revision", "AB", "Subrevision", "App.Order", "App.Quote", false, "ID is different")]
        [InlineData("Group", "45", "Request", "Revision", "AB", "Subrevision", "App.Card", "App.Quote", false, "System is different")]
        [InlineData("Group", "45", "Request", "Revision", "ABC", "Subrevision", "App.Order", "App.Quote", false, "Sales is different")]
        [InlineData("Group1", "45", "Request", "Revision", "AB", "Subrevision", "App.Order", "App.Quote", false, "Group is different")]
        [InlineData("Group", "45", "Request", "Revi", "AB", "Subrevision", "App.Order", "App.Quote", false, "Revision is different")]
        [InlineData("Group", "45", "Request", "Revision", "AB", "Sub", "App.Order", "App.Quote", false, "Subrevision is different")]
        [InlineData("Group", "45", "Request", "Revision", "AB", "Subrevision", "App.Order", "App.Order", false, "Target System is different")]
        public void QuoteLinkDtoEqualsTest(string group,
            string id,
            string request,
            string revision,
            string sales,
            string subrevision,
            string system,
            string targetsystem,
            bool expected,
            string errormsg)
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

            var isEquals = _source.Equals(target);
            isEquals.Should().Be(expected, errormsg);
        }

        [Trait("Category", "Model Test")]
        [Fact(DisplayName = "QuoteLinkDto Test == ")]
        public void QuoteLinkDtoEqualsOperatorTest()
        {
            var target = new QuoteLinkDto
            {
                Revision = _source.Revision,
                Group = _source.Group,
                SubRevision = _source.SubRevision,
                TargetSystem = _source.TargetSystem,
                SalesOrg = _source.SalesOrg,
                System = _source.System,
                ID = _source.ID,
                Request = _source.Request
            };

            (target == _source).Should().BeTrue("Objects is completely equals");
            (_source == null).Should().BeFalse("Right Object is null");
            (null == _source).Should().BeFalse("Left Object is null");

            target.ID = "0009890";
            (target == _source).Should().BeFalse("Objects ID is different");

            target = null;
            (null == target).Should().BeTrue("Both Objects are null");
        }

        [Trait("Category", "Model Test")]
        [Fact(DisplayName = "QuoteLinkDto Test != ")]
        public void QuoteLinkDtoUnequalsOperatorTest()
        {
            var target = new QuoteLinkDto
            {
                Revision = _source.Revision,
                Group = _source.Group,
                SubRevision = _source.SubRevision,
                TargetSystem = _source.TargetSystem,
                SalesOrg = _source.SalesOrg,
                System = _source.System,
                ID = _source.ID,
                Request = _source.Request
            };

            (target != _source).Should().BeFalse("Objects is completely equals");

            target.ID = "0009890";
            (target != _source).Should().BeTrue("Objects ID is different");

            (_source != null).Should().BeTrue("Right Object is null");
            (null != _source).Should().BeTrue("Left Object is null");

            target = null;
            (null != target).Should().BeFalse("Both Objects are null");
        }
    }
}