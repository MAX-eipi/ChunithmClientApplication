using ClosedXML.Excel;
using System.IO;

namespace ChunithmClientLibrary.Writer
{
    public abstract class XmlWriter<TData> : IWriter<TData>
    {
        public XLWorkbook Workbook { get; protected set; }

        public virtual void Write(string path)
        {
            if (Workbook == null)
            {
                return;
            }

            var directory = Path.GetDirectoryName(path);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            Workbook.SaveAs(path);
        }

        public virtual void Set(TData data)
        {
            Workbook = CreateWorkbook(data);
        }

        public abstract XLWorkbook CreateWorkbook(TData data);
    }
}
