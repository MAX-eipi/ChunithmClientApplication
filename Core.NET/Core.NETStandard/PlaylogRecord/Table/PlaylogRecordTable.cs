using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Table;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.PlaylogRecord
{
    [DataContract]
    public sealed class PlaylogRecordTable : SerializableTable<IPlaylogRecordTableUnit>, IPlaylogRecordTable<IPlaylogRecordTableUnit>
    {
        [DataMember]
        public IList<PlaylogRecordTableUnit> TableUnits { get; private set; } = new List<PlaylogRecordTableUnit>();

        public PlaylogRecordTable() { }

        public PlaylogRecordTable(IPlaylogRecordTable<IPlaylogRecordTableUnit> record)
        {
            Set(record);
        }

        public override IEnumerable<IPlaylogRecordTableUnit> GetTableUnits()
        {
            return TableUnits?.AsEnumerable<IPlaylogRecordTableUnit>();
        }

        public override void Add<UTableUnit>(UTableUnit tableUnit)
        {
            if (tableUnit == null)
            {
                return;
            }

            TableUnits.Add(new PlaylogRecordTableUnit(tableUnit));
        }

        public void Add(Playlog playlog)
        {
            if (playlog == null)
            {
                throw new System.ArgumentNullException(nameof(playlog));
            }

            foreach (var unit in playlog.Units)
            {
                Add(new PlaylogRecordTableUnit(unit));
            }
        }

        public override void Clear()
        {
            TableUnits.Clear();
        }
    }
}
