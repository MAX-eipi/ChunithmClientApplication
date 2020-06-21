using ChunithmClientLibrary.ChunithmNet.API;
using System;
using System.Net.Http;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public sealed partial class ChunithmNetHttpClientConnector : IChunithmNetConnector, IDisposable
    {
        private HttpClient client = new HttpClient();
        private string token;

        public bool IsLoggedIn()
        {
            return !string.IsNullOrEmpty(token);
        }

        public void Dispose()
        {
            client.Dispose();
            client = null;
        }
    }
}
