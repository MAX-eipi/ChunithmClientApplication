namespace ChunithmClientLibrary.Writer
{
    public interface IWriter<TData>
    {
        void Set(TData data);
        void Write(string path);
    }
}
