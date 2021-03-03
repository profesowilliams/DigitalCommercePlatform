using DigitalFoundation.Common.Services;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Catalog
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
            => DefaultProgram.RunUI<Startup>(typeof(Program), args);
    }
}