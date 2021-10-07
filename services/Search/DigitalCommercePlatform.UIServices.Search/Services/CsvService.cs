//2021 (c) Tech Data Corporation -. All Rights Reserved.

using CsvHelper;
using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface ICsvService
    {
        Task<IEnumerable<T>> ReadFileAsync<T>(Stream fileStream);

        Task<IEnumerable<T>> ReadFileAsync<T>(byte[] file);

        Task<Stream> GenerateFileStreamAsync<T>(IEnumerable<T> data);

        Task<byte[]> GenerateFileAsync<T>(IEnumerable<T> data);
    }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Major Code Smell", "S3881:\"IDisposable\" should be implemented correctly", Justification = "<Pending>")]
    [ExcludeFromCodeCoverage]
    public class CsvService : ICsvService, IDisposable
    {
        private readonly List<IDisposable> _streamToDispose;
        private static readonly Dictionary<Type, Type> _mappings;

        static CsvService()
        {
            _mappings = typeof(CsvService).Assembly
                .GetTypes()
                .Where(t => !t.IsAbstract
                                    && !t.IsInterface
                                    && t.BaseType != null
                                    && t.BaseType.IsGenericType
                                    && t.BaseType.GetGenericTypeDefinition() == typeof(ClassMap<>))
                .Select(x => new { MapperType = x, ModelType = x.BaseType.GetGenericArguments()[0] })
                .GroupBy(x => x.ModelType)
                .ToDictionary(k => k.Key, v => v.First().MapperType)
                ;
        }

        public CsvService()
        {
            _streamToDispose = new List<IDisposable>();
        }

        public Task<byte[]> GenerateFileAsync<T>(IEnumerable<T> data)
        {
            return ReadFully(GenerateFileStreamFromData(data).Result);
        }

        public Task<Stream> GenerateFileStreamAsync<T>(IEnumerable<T> data)
        {
            return GenerateFileStreamFromData(data);
        }

        public Task<IEnumerable<T>> ReadFileAsync<T>(Stream fileStream)
        {
            TextReader tr = CreateStream(new StreamReader(fileStream));
            var csv = CreateStream(new CsvReader(tr, CultureInfo.CurrentCulture, true));

            var data = csv.GetRecords<T>();

            return Task.FromResult(data);
        }

        public Task<IEnumerable<T>> ReadFileAsync<T>(byte[] file)
        {
            MemoryStream ms = CreateStream(new MemoryStream(file));

            return ReadFileAsync<T>(ms);
        }

        public void Dispose()
        {
            _streamToDispose.ForEach(x => x.Dispose());
        }

        private Task<byte[]> ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            MemoryStream ms = CreateStream(new MemoryStream());

            int read;
            while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
            {
                ms.Write(buffer, 0, read);
            }
            return Task.FromResult(ms.ToArray());
        }

        private Task<Stream> GenerateFileStreamFromData<T>(IEnumerable<T> data)
        {
            var ms = CreateStream(new MemoryStream());
            var sw = CreateStream(new StreamWriter(ms));

            var csv = CreateStream(new CsvWriter(sw, CultureInfo.CurrentCulture, true));

            if (_mappings.ContainsKey(typeof(T)))
                csv.Context.RegisterClassMap(_mappings[typeof(T)]);

            csv.WriteRecords(data);
            csv.Flush();
            sw.Flush();
            ms.Flush();

            ms.Position = 0;
            return Task.FromResult((Stream)ms);
        }

        private T CreateStream<T>(T stream) where T : IDisposable
        {
            _streamToDispose.Add(stream);
            return stream;
        }
    }
}