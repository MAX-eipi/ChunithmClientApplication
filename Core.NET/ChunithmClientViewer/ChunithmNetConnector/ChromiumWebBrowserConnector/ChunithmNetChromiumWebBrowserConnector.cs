using CefSharp.WinForms;
using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public sealed partial class ChunithmNetChromiumWebBrowserConnector : IChunithmNetConnector, IDisposable
    {
        public ChromiumWebBrowser WebBrowser { get; private set; }

        public ChromiumWebBrowserNavigator WebBrowserNavigator { get; private set; }

        public ChunithmNetChromiumWebBrowserConnector(ChromiumWebBrowser webBrowser)
        {
            WebBrowser = webBrowser ?? throw new ArgumentNullException(nameof(webBrowser));
            WebBrowserNavigator = new ChromiumWebBrowserNavigator(WebBrowser);
        }

        public void Dispose()
        {
            WebBrowserNavigator.Dispose();
            WebBrowserNavigator = null;
            WebBrowser = null;
        }
    }
}
