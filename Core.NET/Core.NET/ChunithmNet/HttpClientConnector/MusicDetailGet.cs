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
        private class MusicDetailGetRequest : IMusicDetailGetRequest
        {
            public int Id { get; set; }
        }

        private class MusicDetailGetResponse : ChunithmNetApiResponse, IMusicDetailGetResponse
        {
            public MusicDetail MusicDetail { get; set; }

            public MusicDetailGetResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IMusicDetailGetResponse> GetMusicDetailAsync(int id)
        {
            return GetMusicDetailAsync(new MusicDetailGetRequest
            {
                Id = id
            });
        }

        public async Task<IMusicDetailGetResponse> GetMusicDetailAsync(IMusicDetailGetRequest request)
        {
            var musicDetailContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "idx", request.Id.ToString() },
                { "token", token },
            });

            var musicDetailRequest = client.PostAsync(ChunithmNetUrl.CreateUrl("record/musicGenre/sendMusicDetail"), musicDetailContent);
            await musicDetailRequest;

            var musicDetail = client.GetAsync(ChunithmNetUrl.CreateUrl("record/musicDetail"));
            await musicDetail;

            var response = new MusicDetailGetResponse(musicDetail.Result);
            if (response.Success)
            {
                var musicDetailParser = new MusicDetailParser();
                response.MusicDetail = musicDetailParser.Parse(response.DocumentText);
            }

            return response;
        }
    }
}
