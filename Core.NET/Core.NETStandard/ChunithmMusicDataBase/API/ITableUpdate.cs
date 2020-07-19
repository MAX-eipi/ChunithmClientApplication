using ChunithmClientLibrary.MusicData;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : ITableUpdate
    {
    }

    public interface ITableUpdate
    {
        Task<ITableUpdateResponse> UpdateTableAsync(IList<IMusicDataTableUnit> musicDatas);
        Task<ITableUpdateResponse> UpdateTableAsync(ITableUpdateRequest request);
    }

    public interface ITableUpdateRequest : IChunithmMusicDatabaseApiRequest
    {
        IList<IMusicDataTableUnit> MusicDatas { get; }
    }

    public interface ITableUpdateResponse : IChunithmMusicDatabaseApiResponse
    {
        IMusicDataTable<IMusicDataTableUnit> MusicDataTable { get; }
    }
}
