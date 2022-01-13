//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class DocumentGeneratorSettingsBase : IDocumentGeneratorSettings 
    {
        public string FontName { get; set; } = "Lato Regular";
    }
}
