namespace ChunithmClientLibrary.ChunithmNet.API
{
    public interface IChunithmNetApiRequest
    {
    }

    public interface IChunithmNetApiResponse
    {
        string DocumentText { get; }
        int ErrorCode { get; }
        string ErrorMessage { get; }
        bool Success { get; }
    }
}
