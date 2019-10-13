namespace ChunithmClientLibrary
{
    public enum Genre
    {
        Invalid,
        POPS_AND_ANIME,
        niconico,
        東方Project,
        VARIETY,
        イロドリミドリ,
        言ノ葉Project,
        ORIGINAL,
        All,
    }

    public static partial class Utility
    {
        public static readonly string GENRE_INVALID_TEXT = "INVALID";
        public static readonly string GENRE_POPS_AND_ANIME_TEXT = "POPS & ANIME";
        public static readonly string GENRE_NICONICO_TEXT = "niconico";
        public static readonly string GENRE_東方PROJECT_TEXT = "東方Project";
        public static readonly string GENRE_VARIETY_TEXT = "VARIETY";
        public static readonly string GENRE_イロドリミドリ_TEXT = "イロドリミドリ";
        public static readonly string GENRE_言ノ葉PROJECT_TEXT = "言ノ葉Project";
        public static readonly string GENRE_ORIGINAL_TEXT = "ORIGINAL";
        public static readonly string GENRE_ALL_TEXT = "ALL";

        public static readonly int GENRE_INVALID_CODE = -1;
        public static readonly int GENRE_POPS_AND_ANIME_CODE = 0;
        public static readonly int GENRE_NICONICO_CODE = 2;
        public static readonly int GENRE_東方PROJECT_CODE = 3;
        public static readonly int GENRE_VARIETY_CODE = 6;
        public static readonly int GENRE_イロドリミドリ_CODE = 7;
        public static readonly int GENRE_言ノ葉PROJECT_CODE = 8;
        public static readonly int GENRE_ORIGINAL_CODE = 5;
        public static readonly int GENRE_ALL_CODE = 99;

        private class GenrePair
        {
            public Genre Genre { get; }
            public string Text { get; }
            public int Code { get; }

            public GenrePair(Genre genre, string text, int code)
            {
                Genre = genre;
                Text = text;
                Code = code;
            }
        }

        private static GenrePair[] genrePairs = new GenrePair[]
        {
            new GenrePair(Genre.Invalid, GENRE_INVALID_TEXT, GENRE_INVALID_CODE),
            new GenrePair(Genre.POPS_AND_ANIME, GENRE_POPS_AND_ANIME_TEXT, GENRE_POPS_AND_ANIME_CODE),
            new GenrePair(Genre.niconico, GENRE_NICONICO_TEXT, GENRE_NICONICO_CODE),
            new GenrePair(Genre.東方Project, GENRE_東方PROJECT_TEXT, GENRE_東方PROJECT_CODE),
            new GenrePair(Genre.VARIETY, GENRE_VARIETY_TEXT, GENRE_VARIETY_CODE),
            new GenrePair(Genre.イロドリミドリ, GENRE_イロドリミドリ_TEXT, GENRE_イロドリミドリ_CODE),
            new GenrePair(Genre.言ノ葉Project, GENRE_言ノ葉PROJECT_TEXT, GENRE_言ノ葉PROJECT_CODE),
            new GenrePair(Genre.ORIGINAL, GENRE_ORIGINAL_TEXT, GENRE_ORIGINAL_CODE),
            new GenrePair(Genre.All, GENRE_ALL_TEXT, GENRE_ALL_CODE),
        };

        public static Genre ToGenre(string genreText)
        {
            return PairConverter.Convert(genrePairs, genreText, Genre.Invalid, p => p.Text, p => p.Genre);
        }

        public static string ToGenreText(Genre genre)
        {
            return PairConverter.Convert(genrePairs, genre, GENRE_INVALID_TEXT, p => p.Genre, p => p.Text);
        }

        public static int ToGenreCode(Genre genre)
        {
            return PairConverter.Convert(genrePairs, genre, GENRE_INVALID_CODE, p => p.Genre, p => p.Code);
        }
    }
}
