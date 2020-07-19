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
        private class PlaylogDetailGetRequest : IPlaylogDetailGetRequest
        {
            public int Index { get; set; }
        }

        private class PlaylogDetailGetResponse : ChunithmNetApiResponse, IPlaylogDetailGetResponse
        {
            public PlaylogDetail PlaylogDetail { get; set; }

            public PlaylogDetailGetResponse(WebBrowser webBrowser) : base(webBrowser) { }
        }

        public Task<IPlaylogDetailGetResponse> GetPlaylogDetailAsync(int index)
        {
            return GetPlaylogDetailAsync(new PlaylogDetailGetRequest
            {
                Index = index
            });
        }

        public async Task<IPlaylogDetailGetResponse> GetPlaylogDetailAsync(IPlaylogDetailGetRequest request)
        {
            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.Playlog)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.Playlog);
            }

            var playlogDetail = WebBrowserNavigator.InvokeScriptAsync("pageMove", new object[] { "PlaylogDetail", request.Index });
            await playlogDetail;

            var response = new PlaylogDetailGetResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var playlogDetailParser = new PlaylogDetailParser();
                response.PlaylogDetail = playlogDetailParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }

            return response;
        }
    }
}
