using ChunithmClientLibrary.ChunithmNet.Data;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.API
{
    public partial interface IChunithmNetConnector : ILogin
    {
    }

    public interface ILogin
    {
        Task<ILoginResponse> LoginAsync(string segaId, string password);
        Task<ILoginResponse> LoginAsync(ILoginRequest request);
    }

    public interface ILoginRequest : IChunithmNetApiRequest
    {
        string SegaId { get; }
        string Password { get; }
    }

    public interface ILoginResponse : IChunithmNetApiResponse
    {
        AimeList AimeList { get; set; }
    }
}
