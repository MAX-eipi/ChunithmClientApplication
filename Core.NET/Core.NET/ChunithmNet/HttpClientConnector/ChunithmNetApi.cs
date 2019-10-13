using AngleSharp.Html.Parser;
using ChunithmClientLibrary.ChunithmNet.API;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public class ChunithmNetApiResponse : IChunithmNetApiResponse
    {
        public string DocumentText { get; protected set; }
        public int ErrorCode { get; protected set; }
        public string ErrorMessage { get; protected set; }
        public HttpStatusCode StatusCode { get; protected set; }
        public bool Success { get; protected set; }
        public HttpResponseMessage ResponseMessage { get; protected set; }

        public ChunithmNetApiResponse(HttpResponseMessage message)
        {
            ResponseMessage = message;
            DocumentText = message.Content.ReadAsStringAsync().Result;
            SetErrorInfo(message);
        }

        public virtual void SetErrorInfo(HttpResponseMessage message)
        {
            StatusCode = message.StatusCode;
            Success = message.IsSuccessStatusCode && !IsErrorPase(message);

            if (IsErrorPase(message))
            {
                var document = new HtmlParser().ParseDocument(DocumentText);
                var errorInfo = document.GetElementById("inner").GetElementsByClassName("block")?.FirstOrDefault();

                var errorCodeRegex = new Regex(@"Error Code: (\d*)");
                var errorCodeText = errorCodeRegex.Match(errorInfo.GetElementsByClassName("font_small")?[0]?.TextContent).Groups?[1]?.Value;
                int.TryParse(errorCodeText, out int errorCode);

                var errorMessage = errorInfo.GetElementsByClassName("font_small")?[1]?.TextContent
                    .Replace("\t", "")
                    .Replace("\n", "");

                ErrorCode = errorCode;
                ErrorMessage = errorMessage;
            }
        }

        private bool IsErrorPase(HttpResponseMessage message)
        {
            return message.RequestMessage.RequestUri.OriginalString.Contains("error");
        }
    }
}
