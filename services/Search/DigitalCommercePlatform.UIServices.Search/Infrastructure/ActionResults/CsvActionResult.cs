//2021 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Infrastructure.ActionResults
{
    [ExcludeFromCodeCoverage]
    public class CsvActionResult<T> : IActionResult
    {
        private readonly IEnumerable<T> _data;
        private readonly string _fileName;

        public CsvActionResult(IEnumerable<T> data, string fileName)
        {
            _data = data;
            _fileName = fileName;
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            ICsvService csvService = context.HttpContext.RequestServices.GetRequiredService<ICsvService>();

            context.HttpContext.Response.Headers.Add("Content-Disposition", $"attachment;filename={_fileName}.csv");
            context.HttpContext.Response.Headers.Add("Content-Type", "text/csv");

            await (await csvService.GenerateFileStreamAsync(_data))
                .CopyToAsync(context.HttpContext.Response.Body);
        }
    }
}