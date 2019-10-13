using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IAimeSelect
    {
    }

    public interface IAimeSelect
    {
        Task<IAimeSelectResponse> SelectAimeAsync(int aimeIndex);
        Task<IAimeSelectResponse> SelectAimeAsync(IAimeSelectRequest request);
    }

    public interface IAimeSelectRequest : IChunithmNetApiRequest
    {
        int AimeIndex { get; }
    }

    public interface IAimeSelectResponse : IChunithmNetApiResponse
    { 
    }
}