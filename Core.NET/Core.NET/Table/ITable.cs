using System.Collections.Generic;

namespace ChunithmClientLibrary.Table
{
    public interface ITableUnit
    {
    }

    public interface ITable<TTableUnit> where TTableUnit : ITableUnit
    {
        IEnumerable<TTableUnit> GetTableUnits();

        void Set<UTableUnit>(ITable<UTableUnit> table) where UTableUnit : TTableUnit;
        void Set<UTableUnit>(IEnumerable<UTableUnit> tableUnits) where UTableUnit : TTableUnit;
        void Add<UTableUnit>(ITable<UTableUnit> table) where UTableUnit : TTableUnit;
        void Add<UTableUnit>(IEnumerable<UTableUnit> tableUnits) where UTableUnit : TTableUnit;
        void Add<UTableUnit>(UTableUnit tableUnit) where UTableUnit : TTableUnit;
        void Clear();
    }
}
