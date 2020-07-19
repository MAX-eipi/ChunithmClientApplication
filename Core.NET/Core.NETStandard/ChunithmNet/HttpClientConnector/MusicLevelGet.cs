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
        private class MusicLevelGetRequest : IMusicLevelGetRequest
        {
            public int Level { get; set; }
        }

        private class MusicLevelGetResponse : ChunithmNetApiResponse, IMusicLevelGetResponse
        {
            public MusicLevel MusicLevel { get; set; }

            public MusicLevelGetResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IMusicLevelGetResponse> GetMusicLevelAsync(int level)
        {
            return GetMusicLevelAsync(new MusicLevelGetRequest
            {
                Level = level
            });
        }

        public async Task<IMusicLevelGetResponse> GetMusicLevelAsync(IMusicLevelGetRequest request)
        {
            var musicLevelContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "level", request.Level.ToString() },
                { "token", token },
            });

            var musicLevelRequest = client.PostAsync(ChunithmNetUrl.CreateUrl("record/musicLevel/sendSearch"), musicLevelContent);
            await musicLevelRequest;

            var musicLevel = client.GetAsync(ChunithmNetUrl.CreateUrl("record/musicLevel/search"));
            await musicLevel;

            var response = new MusicLevelGetResponse(musicLevel.Result);
            if (response.Success)
            {
                response.MusicLevel = new MusicLevelParser().Parse(response.DocumentText);
            }
            return response;
        }
    }
}
