namespace ChunithmClientLibrary.Parser
{
    public interface IParser<TSource, TResult>
    {
        TResult Parse(TSource source);
    }
}
