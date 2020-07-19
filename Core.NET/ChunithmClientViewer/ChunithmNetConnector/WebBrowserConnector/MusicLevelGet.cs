using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public partial class ChunithmNetWebBrowserConnector
    {
        private class MusicLevelGetRequest : IMusicLevelGetRequest
        {
            public int Level { get; set; }
        }

        private class MusicLevelGetResponse : ChunithmNetApiResponse, IMusicLevelGetResponse
        {
            public MusicLevel MusicLevel { get; set; }

            public MusicLevelGetResponse(WebBrowser webBrowser) : base(webBrowser) { }
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
            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.MusicLevel)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.MusicLevel);
            }

            {
                var document = WebBrowserNavigator.WebBrowser.Document;
                var content = document.GetElementById("inner");
                var form = content.GetElementsByTagName("form").OfType<HtmlElement>().FirstOrDefault();
                var select = form.GetElementsByTagName("select").OfType<HtmlElement>().FirstOrDefault();
                select.SetAttribute("value", request.Level.ToString());
                var raiseEvent = RaiseEventAsync();
                select.RaiseEvent("onChange");
                await raiseEvent;
            }

            var response = new MusicLevelGetResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var musicLevelParser = new MusicLevelParser();
                response.MusicLevel = musicLevelParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }

            return response;
        }

        private async Task<WebBrowserDocumentCompletedEventArgs> RaiseEventAsync()
        {
            var isNavigating = true;
            WebBrowserDocumentCompletedEventArgs result = null;
            WebBrowserDocumentCompletedEventHandler complete = (sender, e) =>
            {
                isNavigating = false;
                result = e;
            };

            WebBrowserNavigator.WebBrowser.DocumentCompleted += complete;
            await Task.Run(() =>
            {
                while (isNavigating)
                {
                    Thread.Yield();
                }
            });
            WebBrowserNavigator.WebBrowser.DocumentCompleted -= complete;
            return result;
        }
    }
}
