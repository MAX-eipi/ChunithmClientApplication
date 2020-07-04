namespace ChunithmClientLibrary.Reader
{
    public interface IReader<TSource, TResult>
    {
        TResult Read(TSource source);
    }
}
