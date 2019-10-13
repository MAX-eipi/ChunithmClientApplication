using System.Text;
using System.IO;

namespace ChunithmClientLibrary.Writer
{
    public abstract class JsonWriter<TData, TJsonData> : IWriter<TData>
    {
        public TJsonData Object { get; protected set; }

        public virtual void Write(string path)
        {
            if (Object == null)
            {
                return;
            }

            var directory = Path.GetDirectoryName(path);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            using (var stream = new StreamWriter(path, false, Encoding.UTF8))
            {
                stream.Write(Utility.SerializeToJson(Object));
            }
        }

        public void Set(TData data)
        {
            Object = CreateJsonData(data);
        }

        public abstract TJsonData CreateJsonData(TData data);
    }
}
