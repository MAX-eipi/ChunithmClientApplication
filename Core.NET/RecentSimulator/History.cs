using ChunithmClientLibrary.PlaylogRecord;
using ChunithmClientLibrary.Table;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RecentSimulator
{
    public class History : IPlaylogRecordTable<IHistoryUnit>
    {
        public IList<HistoryUnit> TableUnits { get; private set; } = new List<HistoryUnit>();

        public History() { }

        public History(IPlaylogRecordTable<IHistoryUnit> record)
        {
            Set(record);
        }

        public void Add<UTableUnit>(ITable<UTableUnit> table) where UTableUnit : IHistoryUnit
        {
            if (table == null)
            {
                throw new ArgumentNullException(nameof(table));
            }

            Add(table.GetTableUnits());
        }

        public void Add<UTableUnit>(IEnumerable<UTableUnit> tableUnits) where UTableUnit : IHistoryUnit
        {
            if (tableUnits == null)
            {
                throw new ArgumentNullException(nameof(tableUnits));
            }

            foreach (var tableUnit in tableUnits)
            {
                Add(tableUnit);
            }
        }

        public void Add<UTableUnit>(UTableUnit tableUnit) where UTableUnit : IHistoryUnit
        {
            if (tableUnit == null)
            {
                return;
            }

            TableUnits.Add(new HistoryUnit(tableUnit));
        }

        public void Clear()
        {
            TableUnits.Clear();
        }

        public IEnumerable<IHistoryUnit> GetTableUnits()
        {
            return TableUnits?.AsEnumerable();
        }

        public void Set<UTableUnit>(ITable<UTableUnit> table) where UTableUnit : IHistoryUnit
        {
            if (table == null)
            {
                throw new ArgumentNullException(nameof(table));
            }

            Clear();
            Add(table);
        }

        public void Set<UTableUnit>(IEnumerable<UTableUnit> tableUnits) where UTableUnit : IHistoryUnit
        {
            if (tableUnits == null)
            {
                throw new ArgumentNullException(nameof(tableUnits));
            }

            Clear();
            Add(tableUnits);
        }
    }
}
