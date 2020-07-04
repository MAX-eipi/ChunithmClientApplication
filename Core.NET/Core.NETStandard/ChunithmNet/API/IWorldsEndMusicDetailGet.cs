using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IWorldsEndMusicDetailGet
    {
    }

    public interface IWorldsEndMusicDetailGet
    {
        Task<IWorldsEndMusicDetailGetResponse> GetWorldsEndMusicDetailAsync(int id);
        Task<IWorldsEndMusicDetailGetResponse> GetWorldsEndMusicDetailAsync(IWorldsEndMusicDetailGetRequest request);
    }

    public interface IWorldsEndMusicDetailGetRequest : IChunithmNetApiRequest
    {
        int Id { get; }
    }

    public interface IWorldsEndMusicDetailGetResponse : IChunithmNetApiResponse
    {
        WorldsEndMusicDetail WorldsEndMusicDetail { get; }
    }
}
