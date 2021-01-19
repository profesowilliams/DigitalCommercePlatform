using DigitalFoundation.Common.Services;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
            => DefaultProgram.RunApp<Startup>(typeof(Program), args);
    }
}