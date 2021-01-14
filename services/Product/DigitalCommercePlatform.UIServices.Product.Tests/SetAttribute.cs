//using AutoFixture;
//using AutoFixture.Xunit2;
//using System;
//using System.Reflection;

//namespace DigitalFoundation.AppServices.Product.Tests
//{
//    public class SetAttribute : CustomizeAttribute
//    {
//        private readonly Type from;
//        private readonly Type to;

//        public SetAttribute(Type from, Type to)
//        {
//            this.from = from;
//            this.to = to;
//        }

//        public override ICustomization GetCustomization(ParameterInfo parameter)
//        {
//            return new Customization(from, to);
//        }
//    }
//}