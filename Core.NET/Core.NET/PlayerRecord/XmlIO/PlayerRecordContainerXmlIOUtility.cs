using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.PlayerRecord.XmlIO
{
    public class Header
    {
        public enum Parameter
        {
            Id,
            Name,
            Genre,
            Difficulty,
            Score,
            BaseRating,
            Rating,
        }

        public class Column
        {
            public int Index { get; private set; }
            public string Text { get; private set; }
            public Parameter Parameter { get; private set; }

            public Column(int index, string text, Parameter parameter)
            {
                Index = index;
                Text = text;
                Parameter = parameter;
            }
        }

        public static readonly string DEFAULT_ID_TEXT = "ID";
        public static readonly string DEFAULT_NAME_TEXT = "楽曲名";
        public static readonly string DEFAULT_GENRE_TEXT = "ジャンル";
        public static readonly string DEFAULT_DIFFICULTY_TEXT = "難易度";
        public static readonly string DEFAULT_SCORE_TEXT = "スコア";
        public static readonly string DEFAULT_BASE_RATING_TEXT = "譜面定数";
        public static readonly string DEFAULT_RATING_TEXT = "単曲レート値";

        public List<Column> Columns
        {
            get;
            private set;
        }

        public Dictionary<Parameter, Column> GetColumnsMappedByParameter()
        {
            return Columns.ToDictionary(c => c.Parameter, c => c);
        }

        public Header()
        {
            AddColumn(Parameter.Id, DEFAULT_ID_TEXT);
            AddColumn(Parameter.Name, DEFAULT_NAME_TEXT);
            AddColumn(Parameter.Score, DEFAULT_SCORE_TEXT);
            AddColumn(Parameter.BaseRating, DEFAULT_BASE_RATING_TEXT);
            AddColumn(Parameter.Rating, DEFAULT_RATING_TEXT);
            AddColumn(Parameter.Difficulty, DEFAULT_DIFFICULTY_TEXT);
            AddColumn(Parameter.Genre, DEFAULT_GENRE_TEXT);
        }

        private void AddColumn(Parameter parameter, string text)
        {
            if (Columns == null)
            {
                Columns = new List<Column>();
            }

            Columns.Add(new Column(Columns.Count + 1, text, parameter));
        }
    }

    public static class PlayerRecordContainerXmlIOUtility
    {
        public static class Column
        {
            public static int Id { get; }
            public static int Name { get; }
            public static int Genre { get; }
            public static int Difficulty { get; }
            public static int Score { get; }
            public static int BaseRating { get; }
            public static int Rating { get; }

            static Column()
            {
                var column = 1;
                Id = column++;
                Name = column++;
                Score = column++;
                BaseRating = column++;
                Rating = column++;
                Difficulty = column++;
                Genre = column++;
            }
        }
    }
}
