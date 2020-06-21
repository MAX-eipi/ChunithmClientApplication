using ChunithmClientLibrary.MusicData;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IMusicDataUpdate
    {
    }

    public interface IMusicDataUpdate
    {
        Task<IMusicDataUpdateResponse> UpdateMusicDataAsync(IList<IMusicDataTableUnit> musicDatas);
        Task<IMusicDataUpdateResponse> UpdateMusicDataAsync(IMusicDataUpdateRequest request);
    }

    public interface IMusicDataUpdateRequest : IChunithmMusicDatabaseApiRequest
    {
        IList<IMusicDataTableUnit> MusicDatas { get; }
    }

    public interface IMusicDataUpdateResponse : IChunithmMusicDatabaseApiResponse
    {
        IList<IMusicDataTableUnit> UpdatedMusicDatas { get; }
    }
}
