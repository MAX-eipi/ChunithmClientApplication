using ChunithmClientLibrary.ChunithmNet.API;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public partial class ChunithmNetHttpClientConnector
    {
        private class AimeSelectRequest : IAimeSelectRequest
        {
            public int AimeIndex { get; set; }
        }

        private class AimeSelectResponse : ChunithmNetApiResponse, IAimeSelectResponse
        {
            public AimeSelectResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IAimeSelectResponse> SelectAimeAsync(int aimeIndex)
        {
            return SelectAimeAsync(new AimeSelectRequest
            {
                AimeIndex = aimeIndex
            });
        }

        public async Task<IAimeSelectResponse> SelectAimeAsync(IAimeSelectRequest request)
        {
            var selectAimeContent = new FormUrlEncodedContent(new Dictionary<string, string>()
            {
                { "idx", request.AimeIndex.ToString() },
                { "token", token },
            });

            var selectAime = client.PostAsync(ChunithmNetUrl.CreateUrl("aimeList/submit"), selectAimeContent);
            await selectAime;

            var home = client.GetAsync(ChunithmNetUrl.CreateUrl("home"));
            await home;

            var response = new AimeSelectResponse(home.Result);
            return response;
        }
    }
}
