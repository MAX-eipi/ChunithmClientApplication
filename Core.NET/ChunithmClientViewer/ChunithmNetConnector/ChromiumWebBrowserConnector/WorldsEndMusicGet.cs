using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System;
using System.Threading.Tasks;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public partial class ChunithmNetChromiumWebBrowserConnector
    {
        private class WorldsEndMusicGetRequest : IWorldsEndMusicGetRequest
        {
        }

        private class WorldsEndMusicGetResponse : ChunithmNetApiResponse<WorldsEndMusicGetResponse>, IWorldsEndMusicGetResponse
        {
            public WorldsEndMusic WorldsEndMusic { get; set; }
        }

        public Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync()
        {
            return GetWorldsEndMusicAsync(new WorldsEndMusicGetRequest
            {
            });
        }

        public async Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync(IWorldsEndMusicGetRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.WorldsEndMusic)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.WorldsEndMusic);
            }

            var responseAsync = WorldsEndMusicGetResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var worldsEndMusicParser = new WorldsEndMusicParser();
                response.WorldsEndMusic = worldsEndMusicParser.Parse(response.DocumentText);
            }
            return response;
        }
    }
}