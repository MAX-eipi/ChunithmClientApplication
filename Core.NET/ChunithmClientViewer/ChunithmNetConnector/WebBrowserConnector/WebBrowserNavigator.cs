using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public class WebBrowserNavigator : IDisposable
    {
        public WebBrowser WebBrowser { get; private set; }

        public WebBrowserNavigator(WebBrowser webBrowser)
        {
            WebBrowser = webBrowser ?? throw new ArgumentNullException(nameof(webBrowser));
        }

        public async Task<WebBrowserDocumentCompletedEventArgs> NavigateAsync(string url)
        {
            var isNavigating = true;
            WebBrowserDocumentCompletedEventArgs result = null;
            WebBrowserDocumentCompletedEventHandler complete = (sender, e) =>
            {
                isNavigating = false;
                result = e;
            };

            WebBrowser.DocumentCompleted += complete;
            WebBrowser.Navigate(new Uri(url));
            await Task.Run(() =>
            {
                while (isNavigating)
                {
                    Thread.Yield();
                }
            });
            WebBrowser.DocumentCompleted -= complete;

            return result;
        }

        public async Task<WebBrowserDocumentCompletedEventArgs> InvokeScriptAsync(string scriptName, object[] args)
        {
            var isNavigating = true;
            WebBrowserDocumentCompletedEventArgs result = null;
            WebBrowserDocumentCompletedEventHandler complete = (sender, e) =>
            {
                isNavigating = false;
                result = e;
            };

            WebBrowser.DocumentCompleted += complete;
            var script = WebBrowser.Document.InvokeScript(scriptName, args);
            await Task.Run(() =>
            {
                while (isNavigating)
                {
                    Thread.Yield();
                }
            });
            WebBrowser.DocumentCompleted -= complete;
            return result;
        }

        public void Dispose()
        {
            WebBrowser = null;
        }
    }
}
