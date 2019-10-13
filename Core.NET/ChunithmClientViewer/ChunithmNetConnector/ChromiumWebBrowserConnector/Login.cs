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
        private class LoginRequest : ILoginRequest
        {
            public string SegaId { get; set; }
            public string Password { get; set; }
        }

        private class LoginResponse : ChunithmNetApiResponse<LoginResponse>, ILoginResponse
        {
            public AimeList AimeList { get; set; }
        }

        public Task<ILoginResponse> LoginAsync(string segaId, string password)
        {
            return LoginAsync(new LoginRequest
            {
                SegaId = segaId,
                Password = password,
            });
        }

        public async Task<ILoginResponse> LoginAsync(ILoginRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.Top)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.Top);
            }

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
var inputs = document.getElementsByTagName('input');
var inputName = inputs[0];
var inputPassword = inputs[1];
inputName.value = '{request.SegaId}';
inputPassword.value = '{request.Password}';
formSubmit('sega_login');
");

            var responseAsync = LoginResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var aimeListParser = new AimeListParser();
                response.AimeList = aimeListParser.Parse(response.DocumentText);
            }

            return response;
        }
    }
}