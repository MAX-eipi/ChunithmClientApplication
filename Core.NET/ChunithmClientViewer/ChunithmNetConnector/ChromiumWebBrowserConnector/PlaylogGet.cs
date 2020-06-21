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
        private class PlaylogGetRequest : IPlaylogGetRequest
        {
        }

        private class PlaylogGetResponse : ChunithmNetApiResponse<PlaylogGetResponse>, IPlaylogGetResponse
        {
            public Playlog Playlog { get; set; }
        }

        public Task<IPlaylogGetResponse> GetPlaylogAsync()
        {
            return GetPlaylogAsync(new PlaylogGetRequest
            {
            });
        }

        public async Task<IPlaylogGetResponse> GetPlaylogAsync(IPlaylogGetRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.Playlog)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.Playlog);
            }

            var responseAsync = PlaylogGetResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var playlogParser = new PlaylogParser();
                response.Playlog = playlogParser.Parse(response.DocumentText);
            }
            return response;
        }
    }
}
