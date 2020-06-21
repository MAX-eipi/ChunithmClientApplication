using ChunithmClientLibrary.ChunithmNet.Data;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.HighScoreRecord
{ 
    [DataContract]
    public sealed class WorldsEndHighScoreRecordTable : HighScoreRecordTable<IWorldsEndHighScoreRecordTableUnit>
    {
        [DataMember]
        public IList<WorldsEndHighScoreRecordTableUnit> TableUnits { get; private set; } = new List<WorldsEndHighScoreRecordTableUnit>();

        public WorldsEndHighScoreRecordTable() { }

        public WorldsEndHighScoreRecordTable(IHighScoreRecordTable<IWorldsEndHighScoreRecordTableUnit> table)
        {
            Set(table);
        }

        public override IEnumerable<IWorldsEndHighScoreRecordTableUnit> GetTableUnits()
        {
            return TableUnits?.AsEnumerable<IWorldsEndHighScoreRecordTableUnit>();
        }

        public void Add(WorldsEndMusic worldsEndMusic)
        {
            if (worldsEndMusic == null)
            {
                throw new System.ArgumentNullException(nameof(worldsEndMusic));
            }

            foreach (var unit in worldsEndMusic.Units)
            {
            }
        }

        public override void Add<TTableUnit>(TTableUnit tableUnit)
        {
            if (tableUnit == null)
            {
                return;
            }

            TableUnits.Add(new WorldsEndHighScoreRecordTableUnit(tableUnit));
        }

        public override void Clear()
        {
            TableUnits.Clear();
        }
    }
}
