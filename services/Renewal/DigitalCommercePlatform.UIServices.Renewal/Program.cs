//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Services;

namespace DigitalCommercePlatform.UIServices.Renewal
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
            => DefaultProgram.RunUI<Startup>(typeof(Program), args);
    }
}
