using System;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using EV = DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Common.Factories
{
    internal static class FindModelFactory
    {
        static readonly string ValidChars = EV.EstimationValidate.Validator.ValidChars;
        static readonly int Min = EV.EstimationValidate.Validator.MinIdLength;
        static readonly int Max = EV.EstimationValidate.Validator.MaxIdLength;

        internal static FindModel CreateValid(int? idLength = null)
        {
            if (idLength.HasValue)
            {
                if (idLength < Min || idLength > Max)
                {
                    throw new ArgumentException($"{nameof(idLength)} parameter should be between {Min} and {Max}");
                }
            }
            else
            {
                idLength = (int)Math.Floor(0.5 * (Min + Max));
            }

            return new FindModel()
            {
                CreatedFrom = DateTime.UtcNow.AddDays(-2),
                CreatedTo = DateTime.UtcNow.AddDays(-1),
                Id = GenerateValidId(idLength.Value),
                PageNumber = 1,
                PageSize = 10,
            };
        }

        private static string GenerateValidId(int length)
        {
            var result = StringUtils.GenerateRandomString(length, ValidChars);
            return result;
        }
    }
}
