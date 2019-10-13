namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public interface IChunithmMusicDatabaseApiRequest
    {
        string API { get; }
    }

    public interface IChunithmMusicDatabaseApiResponse
    {
        bool Success { get; }
    }
}
