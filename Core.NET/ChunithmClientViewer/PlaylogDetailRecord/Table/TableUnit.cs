using ChunithmClientLibrary.ChunithmNet.Data;
using System;

namespace ChunithmClientViewer.PlaylogDetailRecord
{
    public class TableUnit : ICloneable
    {
        public int Number { get; set; }
        public int PlayCount { get; set; }
        public int LinkNumber { get; set; }
        public PlaylogDetail PlaylogDetail { get; set; }

        object ICloneable.Clone()
        {
            return Clone();
        }

        public TableUnit Clone()
        {
            var recordUnit = new TableUnit();
            recordUnit.Number = Number;
            recordUnit.PlayCount = PlayCount;
            recordUnit.LinkNumber = LinkNumber;
            recordUnit.PlaylogDetail = PlaylogDetail;
            return recordUnit;
        }
    }
}
