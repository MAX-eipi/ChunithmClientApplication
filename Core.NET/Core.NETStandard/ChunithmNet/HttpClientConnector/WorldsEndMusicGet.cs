using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Net.Http;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public partial class ChunithmNetHttpClientConnector
    {
        private class WorldsEndMusicGetRequest : IWorldsEndMusicGetRequest
        {
        }

        private class WorldsEndMusicGetResponse : ChunithmNetApiResponse, IWorldsEndMusicGetResponse
        {
            public WorldsEndMusic WorldsEndMusic { get; set; }

            public WorldsEndMusicGetResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync()
        {
            return GetWorldsEndMusicAsync(new WorldsEndMusicGetRequest
            {
            });
        }

        public async Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync(IWorldsEndMusicGetRequest request)
        {
            var worldsEndMusicGet = client.GetAsync(ChunithmNetUrl.CreateUrl("worldsEnd/worldsEndList"));
            await worldsEndMusicGet;

            var response = new WorldsEndMusicGetResponse(worldsEndMusicGet.Result);
            if (response.Success)
            {
                response.WorldsEndMusic = new WorldsEndMusicParser().Parse(response.DocumentText);
            }
            return response;
        }
    }
}
