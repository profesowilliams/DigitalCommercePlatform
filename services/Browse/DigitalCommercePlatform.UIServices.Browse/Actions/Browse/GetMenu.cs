using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.DTO.Request;
using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
//using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DigitalFoundation.Core.Models.DTO.Common;
using DigitalCommercePlatform.UIServices.Browse.DTO;
using System.Text;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Browse
{

    //public class GetMenuRequest : IRequest<GetMenuResponse>
    //{
    //    public ICollection<Menu> Criteria;

    //    public GetMenuRequest(ICollection<Menu> criteria)
    //    {
    //        Criteria = criteria;
    //    }
    //}

    //public class GetMenuResponse : Response<IEnumerable<Menu>>
    //{
    //    public GetMenuResponse()
    //    {
    //    }

    //    public GetMenuResponse(IEnumerable<Menu> model)
    //    {
    //        ReturnObject = model;
    //    }
    //}

    //public class Handler : IRequestHandler<GetMenuRequest, GetMenuResponse>
    //{
    //    private readonly IMapper _mapper;
    //    private readonly ILogger<Handler> _logger;
    //    private readonly IMiddleTierHttpClient _client;
    //    public string _coreServicePath = string.Empty;

    //    public Handler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory, IOptions<AppSettings> options)
    //    {
    //        _mapper = mapper;
    //        _client = client;
    //        _logger = loggerFactory.CreateLogger<Handler>();
    //        _coreServicePath = options?.Value.GetSetting("Core.Customer.Url");
    //    }

    //    public async Task<GetMenuResponse> Handle(GetMenuRequest request, CancellationToken cancellationToken)
    //    {
    //        string queryParameters = string.Empty;
    //        if (request != null)
    //            queryParameters = GetQueryString(request);

    //        var requestPath = $"{_coreServicePath}v1/?{queryParameters}";
    //        try
    //        {
    //            var customerResponse = await _client
    //                .GetAsync<IEnumerable<Menu>>(requestPath)
    //                .ConfigureAwait(false);

    //            var dtoList = _mapper.Map<IEnumerable<Menu>>(customerResponse);

    //            return new GetMenuResponse(dtoList);
    //        }
    //        catch (Exception ex)
    //        {
    //            _logger.LogError(ex, $"Exception on request to {requestPath}");
    //        }

    //        return null;
    //    }

    //    private static string GetQueryString(GetMenuRequest request)
    //    {
    //        StringBuilder sbqueryParameters = new StringBuilder();

    //        // todo: maybe add this to the common method?
    //        var index = 0;
    //        foreach (var criteria in request.Criteria)
    //        {
    //            var props = criteria.GetType().GetProperties();

    //            foreach (var prop in props)
    //                sbqueryParameters.Append($"{nameof(criteria)}[{index}].{prop.Name}={prop.GetValue(criteria)}&");

    //            index++;
    //        }

    //        return sbqueryParameters.ToString();
    //    }
    //}

    //public class Validator : AbstractValidator<GetMenuRequest>
    //{
    //    public Validator()
    //    {
    //        SetRules();
    //    }

    //    private void SetRules()
    //    {
    //        RuleFor(req => req.Criteria.Count).GreaterThan(0);
    //    }
    //}
}

