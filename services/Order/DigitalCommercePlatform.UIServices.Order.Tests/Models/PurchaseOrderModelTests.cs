using DigitalFoundation.Common.MongoDb.Models;
using FluentAssertions;
using System;
using Xunit;
using static DigitalCommercePlatform.UIService.Order.Models.PurchaseOrderModel;

namespace DigitalCommercePlatform.UIService.Order.Tests.Models
{
    public class PurchaseOrderModelTests
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Summary Model create with Error")]
        public void SummaryFailTest()
        {
            Action action = () => _ = new Summary(null);
            action.Should().Throw<ArgumentNullException>("Model");
        }

        //[Trait("Category", "Set Object")]
        //[Theory]
        //[MemberData(nameof(GetModelExtension))]
        //public void SummarySuccessfullCreatingTest(Model source)
        //{
        //    var target = new Summary(source);

        //    target.Should().NotBeNull();
        //    target.Source.Should().NotBeNull().And.BeAssignableTo<Source>();
        //}

        //public static TheoryData<Model> GetModelExtension()
        //{
        //    return new TheoryData<Model>
        //    {
        //        new Model
        //        {
        //            Created = DateTime.Now,
        //            Updated = DateTime.Now,
        //            Source = new Source
        //            {
        //                ID = "12300090",
        //                SalesOrg = "DataSourceExtensions",
        //                System = "Testing"
        //            },
        //            Vendor = "Unit testing",
        //            Items = null
        //        }
        //    };
        //}
    }
}