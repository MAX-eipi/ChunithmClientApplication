using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Table;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.HighScoreRecord
{
    [DataContract]
    public abstract class HighScoreRecordTable<THighScoreRecordTableUnit> : SerializableTable<THighScoreRecordTableUnit>, IHighScoreRecordTable<THighScoreRecordTableUnit>
        where THighScoreRecordTableUnit : IHighScoreRecordTableUnit
    {
    }

    [DataContract]
    public sealed class HighScoreRecordTable : HighScoreRecordTable<IHighScoreRecordTableUnit>
    {
        [DataMember]
        public IList<HighScoreRecordTableUnit> TableUnits { get; private set; } = new List<HighScoreRecordTableUnit>();

        public HighScoreRecordTable() { }

        public HighScoreRecordTable(IHighScoreRecordTable<IHighScoreRecordTableUnit> table)
        {
            Set(table);
        }

        public override IEnumerable<IHighScoreRecordTableUnit> GetTableUnits()
        {
            return TableUnits?.AsEnumerable<IHighScoreRecordTableUnit>();
        }

        public override void Add<TTableUnit>(TTableUnit tableUnit)
        {
            if (tableUnit == null)
            {
                return;
            }

            TableUnits.Add(new HighScoreRecordTableUnit(tableUnit));
        }

        public void Add(MusicLevel musicLevel)
        {
            if (musicLevel == null)
            {
                throw new System.ArgumentNullException(nameof(musicLevel));
            }

            foreach (var unit in musicLevel.Units)
            {
                Add(new HighScoreRecordTableUnit(unit));
            }
        }

        public void Add(MusicGenre musicGenre)
        {
            if (musicGenre == null)
            {
                throw new System.ArgumentNullException(nameof(musicGenre));
            }

            foreach (var unit in musicGenre.Units)
            {
                Add(new HighScoreRecordTableUnit(unit));
            }
        }

        public override void Clear()
        {
            TableUnits.Clear();
        }
    }
}
