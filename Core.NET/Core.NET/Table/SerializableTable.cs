using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.Table
{
    [DataContract]
    public abstract class SerializableTable<TTableUnit> : ITable<TTableUnit>
        where TTableUnit : ITableUnit
    {
        public virtual void Set<UTableUnit>(ITable<UTableUnit> table)
            where UTableUnit : TTableUnit
        {
            if (table == null)
            {
                throw new ArgumentNullException(nameof(table));
            }

            Clear();
            Add(table);
        }

        public virtual void Set<UTableUnit>(IEnumerable<UTableUnit> tableUnits)
            where UTableUnit : TTableUnit
        {
            if (tableUnits == null)
            {
                throw new ArgumentNullException(nameof(tableUnits));
            }

            Clear();
            Add(tableUnits);
        }

        public virtual void Add<UTableUnit>(ITable<UTableUnit> table)
            where UTableUnit : TTableUnit
        {
            if (table == null)
            {
                throw new ArgumentNullException(nameof(table));
            }

            Add(table.GetTableUnits());
        }

        public virtual void Add<UTableUnit>(IEnumerable<UTableUnit> tableUnits)
            where UTableUnit : TTableUnit
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

        public abstract IEnumerable<TTableUnit> GetTableUnits();
        public abstract void Add<UTableUnit>(UTableUnit tableUnit) where UTableUnit : TTableUnit;
        public abstract void Clear();
    }
}
