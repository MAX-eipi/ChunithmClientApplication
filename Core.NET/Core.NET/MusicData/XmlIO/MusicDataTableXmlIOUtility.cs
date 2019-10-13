using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.MusicData.XmlIO
{
    public class Header
    {
        public enum Parameter
        {
            Index,
            Id,
            Name,
            Genre,
            Basic,
            Advanced,
            Expert,
            Master,
            BasicVerified,
            AdvancedVerified,
            ExpertVerified,
            MasterVerified,
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

        public static readonly string DEFAULT_INDEX_TEXT = "番号";
        public static readonly string DEFAULT_ID_TEXT = "ID";
        public static readonly string DEFAULT_NAME_TEXT = "楽曲名";
        public static readonly string DEFAULT_GENRE_TEXT = "ジャンル";
        public static readonly string DEFAULT_BASIC_TEXT = "BASIC";
        public static readonly string DEFAULT_ADVANCED_TEXT = "ADVANCED";
        public static readonly string DEFAULT_EXPERT_TEXT = "EXPERT";
        public static readonly string DEFAULT_MASTER_TEXT = "MASTER";
        public static readonly string DEFAULT_BASIC_VERIFIED_TEXT = "BASIC 検証";
        public static readonly string DEFAULT_ADVANCED_VERIFIED_TEXT = "ADVANCED 検証";
        public static readonly string DEFAULT_EXPERT_VERIFIED_TEXT = "EXPERT 検証";
        public static readonly string DEFAULT_MASTER_VERIFIED_TEXT = "MASTER 検証";

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
            AddColumn(Parameter.Index, DEFAULT_INDEX_TEXT);
            AddColumn(Parameter.Id, DEFAULT_ID_TEXT);
            AddColumn(Parameter.Name, DEFAULT_NAME_TEXT);
            AddColumn(Parameter.Genre, DEFAULT_GENRE_TEXT);
            AddColumn(Parameter.Basic, DEFAULT_BASIC_TEXT);
            AddColumn(Parameter.Advanced, DEFAULT_ADVANCED_TEXT);
            AddColumn(Parameter.Expert, DEFAULT_EXPERT_TEXT);
            AddColumn(Parameter.Master, DEFAULT_MASTER_TEXT);
            AddColumn(Parameter.BasicVerified, DEFAULT_BASIC_VERIFIED_TEXT);
            AddColumn(Parameter.AdvancedVerified, DEFAULT_ADVANCED_TEXT);
            AddColumn(Parameter.ExpertVerified, DEFAULT_EXPERT_TEXT);
            AddColumn(Parameter.MasterVerified, DEFAULT_MASTER_VERIFIED_TEXT);
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

    public static class MusicDataTableXmlIOUtility
    {
        public static class Column
        {
            public static int Index { get; }
            public static int Id { get; }
            public static int Name { get; }
            public static int Genre { get; }
            public static int Basic { get; }
            public static int Advanced { get; }
            public static int Expert { get; }
            public static int Master { get; }
            public static int BasicVerified { get; }
            public static int AdvancedVerified { get; }
            public static int ExpertVerified { get; }
            public static int MasterVerified { get; }

            static Column()
            {
                var column = 1;
                Index = column++;
                Id = column++;
                Name = column++;
                Genre = column++;
                Basic = column++;
                Advanced = column++;
                Expert = column++;
                Master = column++;
                BasicVerified = column++;
                AdvancedVerified = column++;
                ExpertVerified = column++;
                MasterVerified = column++;
            }
        }
    }
}
