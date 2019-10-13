using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using System;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public partial class ChunithmNetWebBrowserConnector
    {
        private class AimeSelectRequest : IAimeSelectRequest
        {
            public int AimeIndex { get; set; }
        }

        private class AimeSelectResponse : ChunithmNetApiResponse, IAimeSelectResponse
        {
            public AimeSelectResponse(WebBrowser webBrowser) : base(webBrowser) { }
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

            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.AimeList)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.AimeList);
            }

            var select = WebBrowserNavigator.InvokeScriptAsync("formSubmit", new[] { $"aime_login_{request.AimeIndex}" });
            await select;

            var response = new AimeSelectResponse(WebBrowserNavigator.WebBrowser);
            return response;
        }
    }
}
