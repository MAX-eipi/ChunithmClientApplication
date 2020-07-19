using CefSharp;
using CefSharp.WinForms;

namespace ChunithmClientViewer
{
    public static class WebBrowserSettings
    {
        private const string FEATURE_BROWSER_EMULATION = @"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION";
        private static Microsoft.Win32.RegistryKey regkey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(FEATURE_BROWSER_EMULATION);

        private static string process_name = System.Diagnostics.Process.GetCurrentProcess().ProcessName + ".exe";

        public static void Initialize()
        {
            regkey.SetValue(process_name, 11001, Microsoft.Win32.RegistryValueKind.DWord);

            CefSettings settings = new CefSettings();
            settings.BrowserSubprocessPath = @"x86\CefSharp.BrowserSubprocess.exe";
            Cef.Initialize(settings, performDependencyCheck: false, browserProcessHandler: null);
        }

        public static void Shutdown()
        {
            regkey.DeleteValue(process_name);
            regkey.Close();

            Cef.Shutdown();
        }
    }
}
