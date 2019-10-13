using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public partial class ChunithmNetHttpClientConnector
    {
        private class PlaylogDetailGetRequest : IPlaylogDetailGetRequest
        {
            public int Index { get; set; }
        }

        private class PlaylogDetailGetResponse : ChunithmNetApiResponse, IPlaylogDetailGetResponse
        {
            public PlaylogDetail PlaylogDetail { get; set; }

            public PlaylogDetailGetResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IPlaylogDetailGetResponse> GetPlaylogDetailAsync(int index)
        {
            return GetPlaylogDetailAsync(new PlaylogDetailGetRequest
            {
                Index = index
            });
        }

        public async Task<IPlaylogDetailGetResponse> GetPlaylogDetailAsync(IPlaylogDetailGetRequest requestData)
        {
            var playlogDetailContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "idx", requestData.Index.ToString() },
                { "token", token },
            });

            var playlogDetailRequest = client.PostAsync(ChunithmNetUrl.CreateUrl("record/playlog/sendPlaylogDetail"), playlogDetailContent);
            await playlogDetailRequest;

            var playlogDetail = client.GetAsync(ChunithmNetUrl.CreateUrl("record/playlogDetail"));
            await playlogDetail;

            var response = new PlaylogDetailGetResponse(playlogDetail.Result);
            if (response.Success)
            {
                var playlogDetailParser = new PlaylogDetailParser();
                response.PlaylogDetail = playlogDetailParser.Parse(response.DocumentText);
            }

            return response;
        }
    }
}
