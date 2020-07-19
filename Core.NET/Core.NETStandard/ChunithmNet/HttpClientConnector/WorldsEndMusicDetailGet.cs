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
        private class WorldsEndMusicDetailGetRequest : IWorldsEndMusicDetailGetRequest
        {
            public int Id { get; set; }
        }

        private class WorldsEndMusicDetailGetResponse : ChunithmNetApiResponse, IWorldsEndMusicDetailGetResponse
        {
            public WorldsEndMusicDetail WorldsEndMusicDetail { get; set; }

            public WorldsEndMusicDetailGetResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IWorldsEndMusicDetailGetResponse> GetWorldsEndMusicDetailAsync(int id)
        {
            return GetWorldsEndMusicDetailAsync(new WorldsEndMusicDetailGetRequest
            {
                Id = id
            });
        }

        public async Task<IWorldsEndMusicDetailGetResponse> GetWorldsEndMusicDetailAsync(IWorldsEndMusicDetailGetRequest request)
        {
            var worldsEndMusicDetailContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "idx", request.Id.ToString() },
                { "token", token },
            });

            var worldsEndMusicDetailRequest = client.PostAsync(ChunithmNetUrl.CreateUrl("worldsEnd/worldsEndList/sendWorldsEndDetail"), worldsEndMusicDetailContent);
            await worldsEndMusicDetailRequest;

            var worldsEndMusicDetail = client.GetAsync(ChunithmNetUrl.CreateUrl("worldsEnd/worldsEndDetail"));
            await worldsEndMusicDetail;

            var response = new WorldsEndMusicDetailGetResponse(worldsEndMusicDetail.Result);
            if (response.Success)
            {
                var worldsEndMusicDetailParser = new WorldsEndMusicDetailParser();
                response.WorldsEndMusicDetail = worldsEndMusicDetailParser.Parse(response.DocumentText);
            }

            return response;
        }
    }
}
