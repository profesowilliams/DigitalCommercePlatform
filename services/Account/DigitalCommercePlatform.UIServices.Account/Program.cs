//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Services;
using DigitalFoundation.Common.Services.Layer.UI;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
            => BaseUIDefaultProgram.Run<Startup>(typeof(Program), args);
    }
}
