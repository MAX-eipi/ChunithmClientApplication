using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Net.Http;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public partial class ChunithmNetHttpClientConnector
    {
        private class PlaylogGetRequest : IPlaylogGetRequest
        {
        }

        private class PlaylogGetResponse : ChunithmNetApiResponse, IPlaylogGetResponse
        {
            public Data.Playlog Playlog { get; set; }

            public PlaylogGetResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IPlaylogGetResponse> GetPlaylogAsync()
        {
            return GetPlaylogAsync(new PlaylogGetRequest
            {
            });
        }

        public async Task<IPlaylogGetResponse> GetPlaylogAsync(IPlaylogGetRequest requestData)
        {
            var playlog = client.GetAsync(ChunithmNetUrl.CreateUrl("record/playlog"));
            await playlog;

            var response = new PlaylogGetResponse(playlog.Result);
            if (response.Success)
            {
                response.Playlog = new PlaylogParser().Parse(response.DocumentText);
            }
            return response;
        }
    }
}
