using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : IPlaylogDetailGet
    {
    }

    public interface IPlaylogDetailGet
    {
        Task<IPlaylogDetailGetResponse> GetPlaylogDetailAsync(int index);
        Task<IPlaylogDetailGetResponse> GetPlaylogDetailAsync(IPlaylogDetailGetRequest request);
    }

    public interface IPlaylogDetailGetRequest : IChunithmNetApiRequest
    {
        int Index { get; }
    }

    public interface IPlaylogDetailGetResponse : IChunithmNetApiResponse
    {
        PlaylogDetail PlaylogDetail { get; }
    }
}
