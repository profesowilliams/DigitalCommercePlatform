//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class DocumentGeneratorBase<T, U> : IDocumentGenerator<U> 
        where T : IDocumentGeneratorSettings where U : IDocumentModel
    {
        protected abstract T _settings { get; set; }

        public abstract Task<byte[]> XlsGenerate(U model);
    }
}
