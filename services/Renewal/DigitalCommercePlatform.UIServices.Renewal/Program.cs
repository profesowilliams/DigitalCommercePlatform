//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Services.Layer.UI;

namespace DigitalCommercePlatform.UIServices.Renewal
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
            => BaseUIDefaultProgram.Run<Startup>(typeof(Program), args);
    }
}
