using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IWorldsEndMusicGet
    {
    }

    public interface IWorldsEndMusicGet
    {
        Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync();
        Task<IWorldsEndMusicGetResponse> GetWorldsEndMusicAsync(IWorldsEndMusicGetRequest request);
    }

    public interface IWorldsEndMusicGetRequest : IChunithmNetApiRequest
    {
    }

    public interface IWorldsEndMusicGetResponse : IChunithmNetApiResponse
    {
        WorldsEndMusic WorldsEndMusic { get; set; }
    }
}
