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
        private class PlaylogGetRequest : IPlaylogGetRequest
        {
        }

        private class PlaylogGetResponse : ChunithmNetApiResponse, IPlaylogGetResponse
        {
            public Playlog Playlog { get; set; }

            public PlaylogGetResponse(WebBrowser webBrowser) : base(webBrowser) { }
        }

        public Task<IPlaylogGetResponse> GetPlaylogAsync()
        {
            return GetPlaylogAsync(new PlaylogGetRequest
            {
            });
        }

        public async Task<IPlaylogGetResponse> GetPlaylogAsync(IPlaylogGetRequest requestData)
        {
            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.Playlog)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.Playlog);
            }

            var response = new PlaylogGetResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var playlogParser = new PlaylogParser();
                response.Playlog = playlogParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }
            return response;
        }
    }
}
