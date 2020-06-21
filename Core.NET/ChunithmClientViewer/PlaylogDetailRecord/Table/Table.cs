using System.Collections.Generic;

namespace ChunithmClientViewer.PlaylogDetailRecord
{
    public class Table
    {
        public IList<TableUnit> RecordUnits { get; private set; } = new List<TableUnit>();
    }
}
