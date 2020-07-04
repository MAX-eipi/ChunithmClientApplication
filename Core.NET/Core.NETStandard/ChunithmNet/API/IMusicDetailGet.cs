using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IMusicDetailGet
    {
    }

    public interface IMusicDetailGet
    {
        Task<IMusicDetailGetResponse> GetMusicDetailAsync(int id);
        Task<IMusicDetailGetResponse> GetMusicDetailAsync(IMusicDetailGetRequest request);
    }
    
    public interface IMusicDetailGetRequest : IChunithmNetApiRequest
    {
        int Id { get; }
    }

    public interface IMusicDetailGetResponse : IChunithmNetApiResponse
    {
        MusicDetail MusicDetail { get; }
    }
}
