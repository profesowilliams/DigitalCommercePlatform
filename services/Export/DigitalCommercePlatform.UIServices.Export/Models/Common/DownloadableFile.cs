//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Common
{
    [ExcludeFromCodeCoverage]
    public class DownloadableFile
    {
        public byte[] BinaryContent { get; set; }
        public string Filename { get; set; }
        public string MimeType { get; set; }

        public DownloadableFile() { }

        public DownloadableFile(byte[] binaryContent, string filename, string mimeType)
        {
            BinaryContent = binaryContent;
            Filename = filename;
            MimeType = mimeType;
        }
    }
}
