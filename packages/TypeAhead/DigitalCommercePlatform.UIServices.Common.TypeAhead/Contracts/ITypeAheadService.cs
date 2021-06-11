using DigitalCommercePlatform.UIServices.Common.TypeAhead.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.TypeAhead.Contracts
{
    public interface ITypeAheadService
    {
        public Task<IEnumerable<TypeAheadSuggestion>> GetTypeAhead(string SearchTerm, int? MaxResults);
    }
}
