using DigitalFoundation.Common.MongoDb.Models;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class SourceDto : Source
    {
        public string TargetSystem { get; set; }
        public string Key { get; set; }
        public decimal Revision { get; set; }
        public decimal SubRevision { get; set; }

        public override int GetHashCode()
        {
            return base.GetHashCode()
                ^ Revision.GetHashCode()
                ^ SubRevision.GetHashCode();
        }
        public override bool Equals(object obj)
        {
            return base.Equals(obj)
                && obj is SourceDto dto
                && dto.Revision.Equals(Revision)
                && dto.SubRevision.Equals(SubRevision);
        }
        public override string ToString()
        {
            return $"{base.ToString()}.{Revision}.{SubRevision}";
        }
    }
}
