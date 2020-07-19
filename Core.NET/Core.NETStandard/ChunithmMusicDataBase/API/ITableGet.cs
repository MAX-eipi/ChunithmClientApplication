using ChunithmClientLibrary.MusicData;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : ITableGet
    {
    }

    public interface ITableGet
    {
        Task<ITableGetResponse> GetTableAsync();
        Task<ITableGetResponse> GetTableAsync(ITableGetRequest request);
    }

    public interface ITableGetRequest : IChunithmMusicDatabaseApiRequest
    {
    }

    public interface ITableGetResponse : IChunithmMusicDatabaseApiResponse
    {
        IMusicDataTable<IMusicDataTableUnit> MusicDataTable { get; }
    }
}
