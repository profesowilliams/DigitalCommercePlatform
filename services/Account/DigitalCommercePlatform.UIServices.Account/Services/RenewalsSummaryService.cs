//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public class RenewalsSummaryService : IRenewalsSummaryService
    {
        private readonly ITimeProvider _timeProvider;
        private readonly Dictionary<string, Func<string, bool>> _timeRanges;


        public RenewalsSummaryService(ITimeProvider timeProvider)
        {
            _timeProvider = timeProvider ?? throw new ArgumentNullException(nameof(timeProvider));

            _timeRanges = new()
            {
                { "1", expirationDate => DateTime.Parse(expirationDate) >= _timeProvider.Today.AddDays(-30) && DateTime.Parse(expirationDate) <= _timeProvider.Today.AddDays(-1) },
                { "30", expirationDate => DateTime.Parse(expirationDate) >= _timeProvider.Today && DateTime.Parse(expirationDate) <= _timeProvider.Today.AddDays(29) },
                { "60", expirationDate => DateTime.Parse(expirationDate) >= _timeProvider.Today.AddDays(30) && DateTime.Parse(expirationDate) <= _timeProvider.Today.AddDays(59) },
                { "90", expirationDate => DateTime.Parse(expirationDate) >= _timeProvider.Today.AddDays(60) && DateTime.Parse(expirationDate) <= _timeProvider.Today.AddDays(90) }
            };
        }

        public List<RenewalsSummaryModel> GetSummaryItemsFrom(List<string> renewalsExpirationDates)
        {
            var summary = _timeRanges.Select(i => new RenewalsSummaryModel
            {
                Days = i.Key,
                Value = renewalsExpirationDates.Where(i.Value).Count()
            }).ToList();

            return summary;
        }
    }
}
