using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System;
using System.Threading.Tasks;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public partial class ChunithmNetChromiumWebBrowserConnector
    {
        private class PlaylogDetailGetRequest : IPlaylogDetailGetRequest
        {
            public int Index { get; set; }
        }

        private class PlaylogDetailGetResponse : ChunithmNetApiResponse<PlaylogDetailGetResponse>, IPlaylogDetailGetResponse
        {
            public ChunithmClientLibrary.ChunithmNet.Data.PlaylogDetail PlaylogDetail { get; set; }
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
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.Playlog)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.Playlog);
            }

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
pageMove('PlaylogDetail', {request.Index});
");

            var responseAsync = PlaylogDetailGetResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var playlogDetailParser = new PlaylogDetailParser();
                response.PlaylogDetail = playlogDetailParser.Parse(response.DocumentText);
            }

            return response;
        }
    }
}
