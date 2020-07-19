using AngleSharp.Html.Parser;
using System.Linq;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public class ChunithmNetApiResponse
    {
        public string DocumentText { get; protected set; }
        public int ErrorCode { get; protected set; }
        public string ErrorMessage { get; protected set; }
        public bool Success { get; protected set; }

        public ChunithmNetApiResponse(WebBrowser webBrowser)
        {
            DocumentText = webBrowser.DocumentText;
            SetErrorInfo(webBrowser);
        }

        public virtual void SetErrorInfo(WebBrowser webBrowser)
        {
            if (IsErrorPage(webBrowser.Document))
            {
                var _document = new HtmlParser().ParseDocument(webBrowser.DocumentText);
                var errorInfo = _document.GetElementById("inner").GetElementsByClassName("block")?.FirstOrDefault();

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
                Success = true;
            }
        }

        private bool IsErrorPage(HtmlDocument document)
        {
            return document.Url.AbsoluteUri.Contains("Error");
        }
    }
}
