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
        private class MusicDetailGetRequest : IMusicDetailGetRequest
        {
            public int Id { get; set; }
        }

        private class MusicDetailGetResponse : ChunithmNetApiResponse, IMusicDetailGetResponse
        {
            public MusicDetail MusicDetail { get; set; }

            public MusicDetailGetResponse(WebBrowser webBrowser) : base(webBrowser) { }
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
            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.MusicGenre)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.MusicGenre);
            }

            var musicGenre = WebBrowserNavigator.InvokeScriptAsync("formSubmitAddParam", new[] { "music_genre", "level_master" });
            await musicGenre;

            var musicDetail = WebBrowserNavigator.InvokeScriptAsync("formSubmitAddParam", new[] { "music_detail", $"musicId_{request.Id}" });
            await musicDetail;

            var response = new MusicDetailGetResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var musicDetailParser = new MusicDetailParser();
                response.MusicDetail = musicDetailParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }
            return response;
        }
    }
}
