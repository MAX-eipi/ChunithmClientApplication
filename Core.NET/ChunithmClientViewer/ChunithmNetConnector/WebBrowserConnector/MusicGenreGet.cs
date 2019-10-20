using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ChunithmClientViewer.ChunithmNetConnector.WebBrowserConnector
{
    public partial class ChunithmNetWebBrowserConnector
    {
        private class MusicGenreGetRequest : IMusicGenreGetRequest
        {
            [System.Obsolete]
            public Genre Genre { get; set; }
            public int GenreCode { get; set; }
            public Difficulty Difficulty { get; set; }
        }

        private class MusicGenreGetResponse : ChunithmNetApiResponse, IMusicGenreGetResponse
        {
            public MusicGenre MusicGenre { get; set; }

            public MusicGenreGetResponse(WebBrowser webBrowser) : base(webBrowser) { }
        }

        [System.Obsolete]
        public Task<IMusicGenreGetResponse> GetMusicGenreAsync(Genre genre, Difficulty difficulty)
        {
            return GetMusicGenreAsync(Utility.ToGenreCode(genre), difficulty);
        }

        public Task<IMusicGenreGetResponse> GetMusicGenreAsync(int genreCode, Difficulty difficulty)
        {
            return GetMusicGenreAsync(new MusicGenreGetRequest
            {
                GenreCode = genreCode,
                Difficulty = difficulty
            }); ;
        }

        public async Task<IMusicGenreGetResponse> GetMusicGenreAsync(IMusicGenreGetRequest request)
        {
            if (WebBrowserNavigator.WebBrowser.Url?.AbsoluteUri != ChunithmNetUrl.MusicGenre)
            {
                await WebBrowserNavigator.NavigateAsync(ChunithmNetUrl.MusicGenre);
            }

            {
                var documente = WebBrowserNavigator.WebBrowser.Document;
                var musicGenreForm = documente.GetElementById("music_genre");
                var genre = musicGenreForm.GetElementsByTagName("select").OfType<HtmlElement>().FirstOrDefault();
                genre.SetAttribute("value", request.GenreCode.ToString());
            }

            var musicGenre = WebBrowserNavigator.InvokeScriptAsync("formSubmitAddParam", new[] { "music_genre", ToDifficultyParam(request.Difficulty) });
            await musicGenre;

            var response = new MusicGenreGetResponse(WebBrowserNavigator.WebBrowser);
            if (response.Success)
            {
                var musicGenreParser = new MusicGenreParser();
                response.MusicGenre = musicGenreParser.Parse(WebBrowserNavigator.WebBrowser.DocumentText);
            }
            return response;
        }

        private string ToDifficultyParam(Difficulty difficulty)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    return "level_basic";
                case Difficulty.Advanced:
                    return "level_advanced";
                case Difficulty.Expert:
                    return "level_expert";
                case Difficulty.Master:
                    return "level_master";
            }

            return "level_master";
        }
    }
}
