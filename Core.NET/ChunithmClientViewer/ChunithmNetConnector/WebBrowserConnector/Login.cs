using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public partial class ChunithmNetWebBrowserConnector
    {
        private class LoginRequest : ILoginRequest
        {
            public string SegaId { get; set; }
            public string Password { get; set; }
        }

        private class LoginResponse : ChunithmNetApiResponse, ILoginResponse
        {
            public AimeList AimeList { get; set; }

            public LoginResponse(WebBrowser webBrowser) : base(webBrowser) { }
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

            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.Top)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.Top);
            }

            {
                var document = WebBrowserNavigator.WebBrowser.Document;
                var inputs = document.GetElementsByTagName("input");
                var segaIdInput = inputs.GetElementsByName("segaId").OfType<HtmlElement>().FirstOrDefault();
                var passwordInput = inputs.GetElementsByName("password").OfType<HtmlElement>().FirstOrDefault();
                segaIdInput.SetAttribute("value", request.SegaId);
                passwordInput.SetAttribute("value", request.Password);
            }

            var login = WebBrowserNavigator.InvokeScriptAsync("formSubmit", new[] { "sega_login" });
            await login;

            var response = new LoginResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var aimeListParser = new AimeListParser();
                response.AimeList = aimeListParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }
            return response;
        }
    }
}
