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
        private class MusicLevelGetRequest : IMusicLevelGetRequest
        {
            public int Level { get; set; }
        }

        private class MusicLevelGetResponse : ChunithmNetApiResponse<MusicLevelGetResponse>, IMusicLevelGetResponse
        {
            public MusicLevel MusicLevel { get; set; }
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
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.MusicLevel)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.MusicLevel);
            }

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
var levelSelecter = document.getElementsByName('level')[0];
levelSelecter.value = {request.Level};
changeSelecter(levelSelecter);
");

            var responseAsync = MusicLevelGetResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var musicLevelParser = new MusicLevelParser();
                response.MusicLevel = musicLevelParser.Parse(response.DocumentText);
            }
            return response;
        }
    }
}
