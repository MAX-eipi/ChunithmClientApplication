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
        private class WorldsEndMusicDetailGetRequest : IWorldsEndMusicDetailGetRequest
        {
            public int Id { get; set; }
        }

        private class WorldsEndMusicDetailGetResponse : ChunithmNetApiResponse<WorldsEndMusicDetailGetResponse>, IWorldsEndMusicDetailGetResponse
        {
            public WorldsEndMusicDetail WorldsEndMusicDetail { get; set; }
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
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.WorldsEndMusic)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.WorldsEndMusic);
            }

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
formSubmitAddParam('music_detail', 'musicId_{request.Id}');
");

            var responseAsync = WorldsEndMusicDetailGetResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var worldsEndMusicDetailParser = new WorldsEndMusicDetailParser();
                response.WorldsEndMusicDetail = worldsEndMusicDetailParser.Parse(response.DocumentText);
            }
            return response;
        }
    }
}
