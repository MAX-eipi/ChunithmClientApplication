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
        private class WorldsEndMusicGetRequest : IWorldsEndMusicGetRequest
        {
        }

        private class WorldsEndMusicGetResponse : ChunithmNetApiResponse, IWorldsEndMusicGetResponse
        {
            public WorldsEndMusic WorldsEndMusic { get; set; }

            public WorldsEndMusicGetResponse(WebBrowser webBrowser) : base(webBrowser) { }
        }

        public Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync()
        {
            return GetWorldsEndMusicAsync(new WorldsEndMusicGetRequest
            {
            });
        }

        public async Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync(IWorldsEndMusicGetRequest request)
        {
            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.WorldsEndMusic)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.WorldsEndMusic);
            }

            var response = new WorldsEndMusicGetResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var worldsEndMusicParser = new WorldsEndMusicParser();
                response.WorldsEndMusic = worldsEndMusicParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }
            return response;
        }
    }
}
