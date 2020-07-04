using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IPlaylogGet
    {
    }

    public interface IPlaylogGet
    {
        Task<IPlaylogGetResponse> GetPlaylogAsync();
        Task<IPlaylogGetResponse> GetPlaylogAsync(IPlaylogGetRequest request);
    }

    public interface IPlaylogGetRequest : IChunithmNetApiRequest
    {
    }

    public interface IPlaylogGetResponse : IChunithmNetApiResponse
    {
        Playlog Playlog { get; }
    }
}
