using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public partial class ChunithmNetWebBrowserConnector
    {
        private class WorldsEndMusicDetailGetRequest : IWorldsEndMusicDetailGetRequest
        {
            public int Id { get; set; }
        }

        private class WorldsEndMusicDetailGetResponse : ChunithmNetApiResponse, IWorldsEndMusicDetailGetResponse
        {
            public WorldsEndMusicDetail WorldsEndMusicDetail { get; set; }

            public WorldsEndMusicDetailGetResponse(WebBrowser webBrowser) : base(webBrowser) { }
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
            if (WebBrowserNavigator.WebBrowser.Url?.AbsolutePath != ChunithmNetUrl.WorldsEndMusic)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.WorldsEndMusic);
            }

            var worldsEndMusicDetail = WebBrowserNavigator.InvokeScriptAsync("formSubmitAddParam", new[] { "music_detail", $"musicId_{request.Id}" });
            await worldsEndMusicDetail;

            var response = new WorldsEndMusicDetailGetResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var worldsEndMusicDetailParser = new WorldsEndMusicDetailParser();
                response.WorldsEndMusicDetail = worldsEndMusicDetailParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }
            return response;
        }
    }
}
