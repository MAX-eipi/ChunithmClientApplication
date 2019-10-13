using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.PlaylogRecord.XmlIO
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
            Rank,
            BaseRating,
            Rating,
            IsNewRecord,
            IsClear,
            ComboStatus,
            ChainStatus,
            Track,
            PlayDate,
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
        public static readonly string DEFAULT_RANK_TEXT = "ランク";
        public static readonly string DEFAULT_BASE_RATING_TEXT = "譜面定数";
        public static readonly string DEFAULT_RATING_TEXT = "プレイレート";
        public static readonly string DEFAULT_IS_NEW_RECORD_TEXT = "NEW RECORD";
        public static readonly string DEFAULT_IS_CLEAR_TEXT = "クリア";
        public static readonly string DEFAULT_COMBO_STATUS_TEXT = "コンボ";
        public static readonly string DEFAULT_CHAIN_STATUS_TEXT = "チェイン";
        public static readonly string DEFAULT_TRACK_TEXT = "トラック";
        public static readonly string DEFAULT_PLAY_DATE_TEXT = "プレイ日時";

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
            AddColumn(Parameter.PlayDate, DEFAULT_PLAY_DATE_TEXT);
            AddColumn(Parameter.IsNewRecord, DEFAULT_IS_NEW_RECORD_TEXT);
            AddColumn(Parameter.IsClear, DEFAULT_IS_CLEAR_TEXT);
            AddColumn(Parameter.Rank, DEFAULT_RANK_TEXT);
            AddColumn(Parameter.ComboStatus, DEFAULT_COMBO_STATUS_TEXT);
            AddColumn(Parameter.ChainStatus, DEFAULT_CHAIN_STATUS_TEXT);
            AddColumn(Parameter.Track, DEFAULT_TRACK_TEXT);
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
}
