using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using System;
using System.Net.Http;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    public sealed partial class ChunithmMusicDatabaseHttpClientConnector : IChunithmMusicDatabaseConnector, IDisposable
    {
        public string Url { get; }

        private HttpClient client = new HttpClient();

        public ChunithmMusicDatabaseHttpClientConnector(string url)
        {
            Url = url;
        }

        public void Dispose()
        {
            client.Dispose();
            client = null;
        }
    }
}
