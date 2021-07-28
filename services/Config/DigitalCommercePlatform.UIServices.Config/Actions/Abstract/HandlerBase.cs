using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Services;

namespace DigitalCommercePlatform.UIServices.Config.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class HandlerBase<T> where T : class
    {
        protected readonly IMapper _mapper;
        protected readonly ILogger<T> _logger;
        protected readonly IConfigService _configService;

        public HandlerBase(IMapper mapper, ILogger<T> logger, IConfigService configService)
        {
            _mapper = mapper;
            _logger = logger;
            _configService = configService;
        }
    }
}
