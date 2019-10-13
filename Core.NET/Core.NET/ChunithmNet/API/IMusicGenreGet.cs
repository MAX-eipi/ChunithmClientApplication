using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IMusicGenreGet
    {
    }

    public interface IMusicGenreGet
    {
        Task<IMusicGenreGetResponse> GetMusicGenreAsync(Genre genre, Difficulty difficulty);
        Task<IMusicGenreGetResponse> GetMusicGenreAsync(IMusicGenreGetRequest request);
    }

    public interface IMusicGenreGetRequest : IChunithmNetApiRequest
    {
        Genre Genre { get; }
        Difficulty Difficulty { get; }
    }

    public interface IMusicGenreGetResponse : IChunithmNetApiResponse
    {
        MusicGenre MusicGenre { get; }
    }
}
