using CefSharp;
using CefSharp.WinForms;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public class ChromiumWebBrowserNavigator : IDisposable
    {
        public ChromiumWebBrowser WebBrowser { get; private set; }

        public ChromiumWebBrowserNavigator(ChromiumWebBrowser webBrowser)
        {
            WebBrowser = webBrowser ?? throw new ArgumentNullException(nameof(webBrowser));
        }

        public async Task<FrameLoadEndEventArgs> LoadAsync(string url)
        {
            await WaitRequest();

            var isNavigating = true;
            FrameLoadEndEventArgs result = null;
            EventHandler<FrameLoadEndEventArgs> complete = (sender, e) =>
            {
                isNavigating = false;
                result = e;
            };

            WebBrowser.FrameLoadEnd += complete;
            WebBrowser.Load(url);
            await Task.Run(() =>
            {
                while (isNavigating)
                {
                    Thread.Yield();
                }
            });
            WebBrowser.FrameLoadEnd -= complete;
            return result;
        }

        public async Task<JavascriptResponse> EvaluateScriptAsync(string script, TimeSpan? timeSpan = null)
        {
            await WaitRequest();

            JavascriptResponse javascriptResponse = null;
            var task = Task.Run(() =>
            {
                var scriptAsync = WebBrowser.EvaluateScriptAsync(script, timeSpan);
                scriptAsync.Wait();
                javascriptResponse = scriptAsync.Result;
            });

            await task;
            return javascriptResponse;
        }

        public async Task<Tuple<JavascriptResponse, FrameLoadEndEventArgs>> EvaluatePageMoveScriptAsync(string script, TimeSpan? timeSpan = null)
        {
            await WaitRequest();

            var isNavigating = true;
            JavascriptResponse javascriptResponse = null;
            FrameLoadEndEventArgs frameLoadEndEventArgs = null;

            EventHandler<FrameLoadEndEventArgs> complete = (sender, e) =>
            {
                isNavigating = false;
                frameLoadEndEventArgs = e;
            };

            WebBrowser.FrameLoadEnd += complete;

            await Task.Run(() =>
            {
                var scriptAsync = WebBrowser.EvaluateScriptAsync(script, timeSpan);
                scriptAsync.Wait();
                javascriptResponse = scriptAsync.Result;
            });

            await Task.Run(() =>
            {
                while (isNavigating)
                {
                    Thread.Yield();
                }
            });

            WebBrowser.FrameLoadEnd -= complete;

            return new Tuple<JavascriptResponse, FrameLoadEndEventArgs>(javascriptResponse, frameLoadEndEventArgs);
        }

        private async Task WaitRequest()
        {
            if (!WebBrowser.IsBrowserInitialized)
            {
                await Task.Run(() =>
                {
                    while (!WebBrowser.IsBrowserInitialized)
                    {
                        Thread.Yield();
                    }
                });
            }

            if (!WebBrowser.CanExecuteJavascriptInMainFrame)
            {
                await Task.Run(() =>
                {
                    while(!WebBrowser.CanExecuteJavascriptInMainFrame)
                    {
                        Thread.Yield();
                    }
                });
            }

            if (WebBrowser.IsLoading)
            {
                await Task.Run(() =>
                {
                    while (WebBrowser.IsLoading)
                    {
                        Thread.Yield();
                    }
                });
            }
        }

        public void Dispose()
        {
            WebBrowser = null;
        }
    }
}
