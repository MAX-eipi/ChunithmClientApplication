using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public sealed partial class ChunithmNetWebBrowserConnector : IChunithmNetConnector, IDisposable
    {
        [DllImport("wininet.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern bool InternetGetCookieEx(
            string pchURL,
            string pchCookieName,
            StringBuilder pchCookieData,
            ref uint pcchCookieData,
            int dwFlags,
            IntPtr lpReserved
        );

        const int INTERNET_COOKIE_HTTPONLY = 0x00002000;

        public static string GetCookies(string uri)
        {
            uint dataSize = 1024;
            var cookieData = new StringBuilder((int)dataSize);
            var result = InternetGetCookieEx(uri, null, cookieData, ref dataSize, INTERNET_COOKIE_HTTPONLY, IntPtr.Zero);

            if (result && cookieData.Length > 0)
            {
                return cookieData.ToString();
            }
            else
            {
                return null;
            }
        }

        public WebBrowser WebBrowser { get; private set; }

        public WebBrowserNavigator WebBrowserNavigator { get; private set; }

        public event WebBrowserDocumentCompletedEventHandler DocumentCompletead
        {
            add { WebBrowser.DocumentCompleted += value; }
            remove { WebBrowser.DocumentCompleted -= value; }
        }

        public ChunithmNetWebBrowserConnector(WebBrowser webBrowser)
        {
            WebBrowser = webBrowser ?? throw new ArgumentNullException(nameof(webBrowser));
            WebBrowserNavigator = new WebBrowserNavigator(WebBrowser);

            WebBrowser.DocumentCompleted += WebBrowser_DocumentCompleted;
            WebBrowser.Navigate(ChunithmNetUrl.Top);
        }

#if DEBUG
        private bool initialized;
#endif

        private void WebBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
#if DEBUG
            if (!initialized)
            {
                initialized = true;
                DebugLogger.WriteLine("Initializing ChunithmBackendConnector");
            }
#endif

            DebugLogger.WriteLine("DocumentCompleted : {0}", e.Url.AbsoluteUri);
            DebugLogger.WriteLine("Cookie : {0}", GetCookies(e.Url.AbsoluteUri));
        }

        public void Dispose()
        {
            WebBrowserNavigator.Dispose();
            WebBrowserNavigator = null;
            WebBrowser = null;
        }
    }
}
