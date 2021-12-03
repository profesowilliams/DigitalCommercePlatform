//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIService.Browse;
using DigitalFoundation.Common.Services.Layer.UI;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
            => BaseUIDefaultProgram.Run<Startup>(typeof(Program), args);
    }
}