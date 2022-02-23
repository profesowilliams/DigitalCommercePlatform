//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class DocumentGeneratorBase<T, U> : IDocumentGenerator<U> 
        where T : IDocumentGeneratorSettings where U : IDocumentModel
    {
        protected const string NOT_AVAILABLE = "Not available";

        protected abstract T Settings { get; set; }

        public abstract Task<byte[]> XlsGenerate(U model);

        protected static Image GetTdLogo()
        {
            var filename = "td-synnex-logo.png";
            string fileloc = "Content";
            string path = Path.Combine(Directory.GetCurrentDirectory(), fileloc, filename);
            return File.Exists(path) ? Image.FromFile(path) : null;
        }

    }
}
