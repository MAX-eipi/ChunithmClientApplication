using AngleSharp.Html.Parser;
using CefSharp;
using CefSharp.WinForms;
using ChunithmClientLibrary.ChunithmNet.API;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public class ChunithmNetApiResponse : IChunithmNetApiResponse
    {
        public string DocumentText { get; protected set; }
        public int ErrorCode { get; protected set; }
        public string ErrorMessage { get; protected set; }
        public bool Success { get; protected set; }

        protected virtual void Initialize(string url, string documentText)
        {
            if (IsErrorPage(url))
            {
                var document = new HtmlParser().ParseDocument(documentText);
                var errorInfo = document.GetElementById("inner").GetElementsByClassName("block")?.FirstOrDefault();

                var errorCodeRegex = new Regex(@"Error Code: (\d*)");
                var errorCodeText = errorCodeRegex.Match(errorInfo.GetElementsByClassName("font_small")?[0]?.TextContent).Groups?[1]?.Value;
                int.TryParse(errorCodeText, out int errorCode);

                var errorMessage = errorInfo.GetElementsByClassName("font_small")?[1]?.TextContent
                    .Replace("\t", "")
                    .Replace("\n", "");

                ErrorCode = errorCode;
                ErrorMessage = errorMessage;
                Success = false;
            }
            else
            {
                DocumentText = documentText;
                Success = true;
            }
        }

        private bool IsErrorPage(string url)
        {
            return url.Contains("Error");
        }
    }

    public class ChunithmNetApiResponse<TResponse> : ChunithmNetApiResponse
        where TResponse : ChunithmNetApiResponse<TResponse>, new()
    {
        public static async Task<TResponse> CreateResponseAsync(ChromiumWebBrowser webBrowser)
        {
            var url = webBrowser.Address;
            var response = new TResponse();
            JavascriptResponse readDocumentTextResponse = null;
            var readDocumentText = Task.Run(() =>
            {
                var readDocumentTextAsync = webBrowser.EvaluateScriptAsync(@"document.getElementsByTagName('html')[0].innerHTML");
                readDocumentTextAsync.Wait();
                readDocumentTextResponse = readDocumentTextAsync.Result;
            });

            await readDocumentText;
            var documentText = readDocumentTextResponse.Result.ToString();
            response.Initialize(url, documentText);
            return response;
        }
    }
}
