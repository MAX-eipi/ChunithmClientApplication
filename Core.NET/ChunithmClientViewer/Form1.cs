using CefSharp;
using CefSharp.WinForms;
using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Parser;
using ChunithmClientLibrary.MusicData;
using ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector;
using ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector;
using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace ChunithmClientViewer
{
    public partial class MainForm : Form
    {
        private IChunithmNetConnector chunithmNetConnector;
        private WebBrowser chunithmNetWebBrowser;
        private ChromiumWebBrowser chunithmNetChromeWebBrowser;

        private IChunithmNetConnector chunithmNetBackgroundConnector;
        private WebBrowser chunithmNetBackgroundWebBrowser;
        private ChromiumWebBrowser chunithmNetBackgroundChromeWebBrowser;

        private ChunithmMusicDatabaseHttpClientConnector dataManagerConnector;
        private ChromiumWebBrowser dataManagerChromeWebBrowser;

        private const string urlDataManager = "https://docs.google.com/spreadsheets/d/10iLc7sEx4QO0_8eDrFBsI6e1Ei777xSxLxac_mKrCrU/edit?usp=sharing";
        private bool useChromeWebBrowser = false;

        private List<IDisposable> resources = new List<IDisposable>();

        public MainForm()
        {
            WebBrowserSettings.Initialize();
            InitializeComponent();

            if (useChromeWebBrowser)
            {
                chunithmNetChromeWebBrowser = new ChromiumWebBrowser(ChunithmNetUrl.Top);
                chunithmNetTab.Controls.Add(chunithmNetChromeWebBrowser);
                var connector = new ChunithmNetChromiumWebBrowserConnector(chunithmNetChromeWebBrowser);
                chunithmNetConnector = connector;
                resources.Add(connector);
                resources.Add(chunithmNetChromeWebBrowser);

                chunithmNetBackgroundChromeWebBrowser = new ChromiumWebBrowser(ChunithmNetUrl.Top);
                chunithmNetBackgroundChromeWebBrowser.CreateControl();
                var backgroundConnector = new ChunithmNetChromiumWebBrowserConnector(chunithmNetBackgroundChromeWebBrowser);
                chunithmNetBackgroundConnector = backgroundConnector;
                resources.Add(backgroundConnector);
                resources.Add(chunithmNetBackgroundChromeWebBrowser);
            }
            else
            {
                chunithmNetWebBrowser = new WebBrowser();
                chunithmNetWebBrowser.Navigate(ChunithmNetUrl.Top);
                chunithmNetTab.Controls.Add(chunithmNetWebBrowser);
                chunithmNetWebBrowser.Dock = DockStyle.Fill;
                var connector = new ChunithmNetWebBrowserConnector(chunithmNetWebBrowser);
                chunithmNetConnector = connector;
                resources.Add(connector);
                resources.Add(chunithmNetWebBrowser);

                chunithmNetBackgroundWebBrowser = new WebBrowser();
                this.Controls.Add(chunithmNetBackgroundWebBrowser);
                chunithmNetBackgroundWebBrowser.Visible = false;
                var backgroundConnector = new ChunithmNetWebBrowserConnector(chunithmNetBackgroundWebBrowser);
                chunithmNetBackgroundConnector = backgroundConnector;
                resources.Add(backgroundConnector);
                resources.Add(chunithmNetBackgroundWebBrowser);
            }

            dataManagerChromeWebBrowser = new ChromiumWebBrowser(urlDataManager);
            dataManagerTab.Controls.Add(dataManagerChromeWebBrowser);
            dataManagerConnector = new ChunithmMusicDatabaseHttpClientConnector("");
        }

        private async void Form1_Load(object sender, EventArgs e)
        {
        }

        private void chunithmNetBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
        }

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            foreach (var resource in resources)
            {
                resource?.Dispose();
            }

            WebBrowserSettings.Shutdown();
        }

        private async void 楽曲更新ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var maxLevel = 14;
            var loadNum = maxLevel + 1;
            Console.WriteLine($"楽曲の取得中... (1/{loadNum})");

            var musicGenre = chunithmNetBackgroundConnector.GetMusicGenreAsync(Genre.All, Difficulty.Master);
            await musicGenre;
            if (!musicGenre.Result.Success)
            {
                Console.WriteLine("!! Failed !!");
                Console.WriteLine("Error Code : " + musicGenre.Result.ErrorCode);
                Console.WriteLine(musicGenre.Result.ErrorMessage);
                return;
            }
            var musicGenreDocument = musicGenre.Result.DocumentText;

            var musicLevelDocuments = new List<string>();
            for (var i = 1; i <= maxLevel; i++)
            {
                Console.WriteLine($"楽曲の取得中... ({i + 1}/{loadNum})");
                var musicLevel = chunithmNetBackgroundConnector.GetMusicLevelAsync(i);
                await musicLevel;
                if (!musicLevel.Result.Success)
                {
                    Console.WriteLine("!! Failed !!");
                    Console.WriteLine("Error Code : " + musicLevel.Result.ErrorCode);
                    Console.WriteLine(musicLevel.Result.ErrorMessage);
                    return;
                }
                musicLevelDocuments.Add(musicLevel.Result.DocumentText);
            }

            Console.WriteLine("Success");

            Console.WriteLine("楽曲テーブルを生成します...");

            var musicDataTable = new MusicDataTable();
            var musicGenreParser = new MusicGenreParser();
            var musicLevelParser = new MusicLevelParser();
            musicDataTable.Add(musicGenreParser.Parse(musicGenreDocument));
            foreach (var musicLevel in musicLevelDocuments)
            {
                musicDataTable.Add(musicLevelParser.Parse(musicLevel));
            }

            var tableUpdate = dataManagerConnector.UpdateTableAsync(musicDataTable.MusicDatas);
            await tableUpdate;

            Console.WriteLine("Success");
        }

        private async void ChunithmRateAnalyzerToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!useChromeWebBrowser)
            {
                return;
            }

            var script = @"javascript:(function(){function callback(){(function($){var jQuery=$;/* https://mrcoles.com/bookmarklet/ */$(""<script>"").attr(""src"", ""https://zk-phi.github.io/CHUNITHMRateAnalyzerSTAR/chunithm.js"").appendTo(""head"")})(jQuery.noConflict(true))}var s=document.createElement(""script"");s.src=""https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"";if(s.addEventListener){s.addEventListener(""load"",callback,false)}else if(s.readyState){s.onreadystatechange=callback}document.body.appendChild(s);})()";
            var evaluateScriptAsync = chunithmNetChromeWebBrowser.EvaluateScriptAsync(script);
            await evaluateScriptAsync;
            var result = evaluateScriptAsync.Result;
            Console.WriteLine(result.Success);
            Console.WriteLine(result.Message);
        }

        private async void playlogDetailRecordの更新ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var playerDataTable = new PlayerDataTable(chunithmNetBackgroundConnector, dataManagerConnector);
            await playerDataTable.UpdatePlaylogAsync();
        }

        private async void playlogToolStripMenuItem_Click(object sender, EventArgs e)
        {
            await chunithmNetConnector.GetPlaylogAsync();
        }

        private async void playlogDetailGet0ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            await chunithmNetConnector.GetPlaylogDetailAsync(0);
        }

        private async void musicGenreGetAllMASTERToolStripMenuItem_Click(object sender, EventArgs e)
        {
            await chunithmNetConnector.GetMusicGenreAsync(Genre.All, Difficulty.Master);
        }

        private async void musicLevelGet13ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            await chunithmNetConnector.GetMusicLevelAsync(13);
        }

        private async void musicDetailGet409ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            await chunithmNetConnector.GetMusicDetailAsync(409);
        }

        private async void worldsEndMusicGetToolStripMenuItem_Click(object sender, EventArgs e)
        {
            await chunithmNetConnector.GetWorldsEndMusicAsync();
        }

        private async void worldsEndMusicDetailGetToolStripMenuItem_Click(object sender, EventArgs e)
        {
            await chunithmNetConnector.GetWorldsEndMusicDetailAsync(8108);
        }
    }
}
