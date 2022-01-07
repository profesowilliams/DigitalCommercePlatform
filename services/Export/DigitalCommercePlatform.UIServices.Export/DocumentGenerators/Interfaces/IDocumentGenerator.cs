//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces
{
    public interface IDocumentGenerator<U> where U : IDocumentModel
    {
        abstract Task<byte[]> XlsGenerate(U model);
    }
}
