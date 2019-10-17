using AngleSharp.Html.Parser;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public partial class ChunithmNetHttpClientConnector
    {
        private class LoginRequest : ILoginRequest
        {
            public string SegaId { get; set; }
            public string Password { get; set; }
        }

        private class LoginResponse : ChunithmNetApiResponse, ILoginResponse
        {
            public AimeList AimeList { get; set; }

            public LoginResponse(HttpResponseMessage message) : base(message) { }

            public void OnInvalidAimeList()
            {
                Success = false;
            }
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
            if (!IsLoggedIn())
            {
                await GetToken();
            }

            var loginContent = new FormUrlEncodedContent(new Dictionary<string, string>()
            {
                { "segaId", request.SegaId },
                { "password", request.Password },
                { "token", token },
            });

            var postLogin = client.PostAsync(ChunithmNetUrl.CreateUrl("submit"), loginContent);
            await postLogin;

            var getAimeList = client.GetAsync(ChunithmNetUrl.CreateUrl("aimeList"));
            await getAimeList;

            var response = new LoginResponse(getAimeList.Result);

            if (response.Success)
            {
                var aimeListParser = new AimeListParser();
                response.AimeList = aimeListParser.Parse(response.DocumentText);
                if (response.AimeList == null)
                {
                    response.OnInvalidAimeList();
                }
            }

            return response;
        }

        private async Task GetToken()
        {
            var requestRoot = client.GetAsync(ChunithmNetUrl.Root);
            await requestRoot;

            var root = new ChunithmNetApiResponse(requestRoot.Result);
            if (!root.Success)
            {
                return;
            }

            var parseDocument = new HtmlParser().ParseDocumentAsync(root.DocumentText);
            await parseDocument;
            var document = parseDocument.Result;
            if (document == null)
            {
                return;
            }

            token = document.QuerySelector("div.login_form input[name='token']")?.GetAttribute("value");
        }
    }
}
