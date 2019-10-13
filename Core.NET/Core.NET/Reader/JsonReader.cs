namespace ChunithmClientLibrary.Reader
{
    public class JsonReader<TResult> : IReader<string, TResult>
    {
        public virtual TResult Read(string json)
        {
            return Utility.DeserializeFromJson<TResult>(json);
        }
    }
}
