//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIService.Product;
using DigitalFoundation.Common.Services;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
            => DefaultProgram.RunUI<Startup>(typeof(Program), args);
    }
}