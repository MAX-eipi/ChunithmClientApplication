using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System;
using System.Threading.Tasks;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public partial class ChunithmNetChromiumWebBrowserConnector
    {
        private class MusicDetailGetRequest : IMusicDetailGetRequest
        {
            public int Id { get; set; }
        }

        private class MusicDetailGetResponse : ChunithmNetApiResponse<MusicDetailGetResponse>, IMusicDetailGetResponse
        {
            public ChunithmClientLibrary.ChunithmNet.Data.MusicDetail MusicDetail { get; set; }
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
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.MusicGenre)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.MusicGenre);
            }

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
var genreSelecter = document.getElementsByName('genre')[0];
genreSelecter.value = 99;
formSubmitAddParam('music_genre', 'level_master');
");

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
formSubmitAddParam('music_detail', 'musicId_{request.Id}');
");

            var responseAsync = MusicDetailGetResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var musicDetailParser = new MusicDetailParser();
                response.MusicDetail = musicDetailParser.Parse(response.DocumentText);
            }
            return response;
        }
    }
}
