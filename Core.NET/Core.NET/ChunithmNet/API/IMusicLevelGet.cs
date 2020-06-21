using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IMusicLevelGet
    {
    }

    public interface IMusicLevelGet
    {
        Task<IMusicLevelGetResponse> GetMusicLevelAsync(int level);
        Task<IMusicLevelGetResponse> GetMusicLevelAsync(IMusicLevelGetRequest request);
    }

    public interface IMusicLevelGetRequest : IChunithmNetApiRequest
    {
        int Level { get; }
    }

    public interface IMusicLevelGetResponse : IChunithmNetApiResponse
    {
        MusicLevel MusicLevel { get; set; }
    }
}
