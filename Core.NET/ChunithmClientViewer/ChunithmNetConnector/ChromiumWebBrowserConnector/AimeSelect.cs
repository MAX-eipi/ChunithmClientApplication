using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using System;
using System.Threading.Tasks;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public partial class ChunithmNetChromiumWebBrowserConnector
    {
        private class AimeSelectRequest : IAimeSelectRequest
        {
            public int AimeIndex { get; set; }
        }

        private class AimeSelectResponse : ChunithmNetApiResponse<AimeSelectResponse>, IAimeSelectResponse
        {
        }

        public Task<IAimeSelectResponse> SelectAimeAsync(int aimeIndex)
        {
            return SelectAimeAsync(new AimeSelectRequest
            {
                AimeIndex = aimeIndex
            });
        }

        public async Task<IAimeSelectResponse> SelectAimeAsync(IAimeSelectRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.AimeList)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.AimeList);
            }

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
formSubmit('aime_login_{request.AimeIndex}');
");

            var responseAsync = AimeSelectResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            return response;
        }
    }
}