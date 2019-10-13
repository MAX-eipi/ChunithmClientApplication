using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System;
using System.Threading.Tasks;

namespace ChunithmClientViewer.ChunithmNetConnector.ChromiumWebBrowserConnector
{
    public partial class ChunithmNetChromiumWebBrowserConnector
    {
        private class MusicGenreGetRequest : IMusicGenreGetRequest
        {
            public Genre Genre { get; set; }
            public Difficulty Difficulty { get; set; }
        }

        private class MusicGenreGetResponse : ChunithmNetApiResponse<MusicGenreGetResponse>, IMusicGenreGetResponse
        {
            public MusicGenre MusicGenre { get; set; }
        }

        public Task<IMusicGenreGetResponse> GetMusicGenreAsync(Genre genre, Difficulty difficulty)
        {
            return GetMusicGenreAsync(new MusicGenreGetRequest
            {
                Genre = genre,
                Difficulty = difficulty,
            });
        }

        public async Task<IMusicGenreGetResponse> GetMusicGenreAsync(IMusicGenreGetRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (WebBrowserNavigator.WebBrowser.Address != ChunithmNetUrl.MusicGenre)
            {
                await WebBrowserNavigator.LoadAsync(ChunithmNetUrl.MusicGenre);
            }

            await WebBrowserNavigator.EvaluatePageMoveScriptAsync($@"
var genreSelecter  = document.getElementsByName('genre')[0];
genreSelecter.value = { Utility.ToGenreCode(request.Genre) };
formSubmitAddParam('music_genre','{ ToDifficultyParam(request.Difficulty) }');
");

            var responseAsync = MusicGenreGetResponse.CreateResponseAsync(WebBrowserNavigator.WebBrowser);
            await responseAsync;
            var response = responseAsync.Result;
            if (response.Success)
            {
                var musicGenreParser = new MusicGenreParser();
                response.MusicGenre = musicGenreParser.Parse(response.DocumentText);
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
