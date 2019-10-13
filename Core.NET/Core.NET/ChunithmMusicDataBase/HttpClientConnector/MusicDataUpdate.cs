using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.MusicData;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        [DataContract]
        private class InternalMusicDataUpdateRequest : ChunithmMusicDatabaseApiRequest
        {
            [DataMember]
            public string API { get; set; } = ApiName.MusicDataUpdate;

            [DataMember]
            public List<MusicDataTableUnit> MusicDatas;
        }

        [DataContract]
        private class InternalMusicDataUpdateResponse : ChunithmMusicDatabaseApiResponse
        {
            [DataMember]
            public List<MusicDataTableUnit> UpdatedMusicDatas;
        }

        private class MusicDataUpdateResponse : IMusicDataUpdateResponse
        {
            public IList<IMusicDataTableUnit> UpdatedMusicDatas { get; private set; }

            public bool Success { get; private set; }

            public MusicDataUpdateResponse(InternalMusicDataUpdateResponse response)
            {
                UpdatedMusicDatas = response.UpdatedMusicDatas.Cast<IMusicDataTableUnit>().ToList();
                Success = response.Success;
            }
        }

        public async Task<IMusicDataUpdateResponse> UpdateMusicDataAsync(IList<IMusicDataTableUnit> musicDatas)
        {
            var resposne = UpdateMusicDataAsync(new InternalMusicDataUpdateRequest
            {
                MusicDatas = musicDatas.Select(m => new MusicDataTableUnit(m)).ToList(),
            });
            await resposne;
            return new MusicDataUpdateResponse(resposne.Result);
        }

        public async Task<IMusicDataUpdateResponse> UpdateMusicDataAsync(IMusicDataUpdateRequest request)
        {
            var resposne = UpdateMusicDataAsync(new InternalMusicDataUpdateRequest
            {
                API = request.API,
                MusicDatas = request.MusicDatas.Select(m => new MusicDataTableUnit(m)).ToList(),
            });
            await resposne;
            return new MusicDataUpdateResponse(resposne.Result);
        }

        private async Task<InternalMusicDataUpdateResponse> UpdateMusicDataAsync(InternalMusicDataUpdateRequest request)
        {
            var postAsync = client.PostAsync(Url, new StringContent(Utility.SerializeToJson(request), Encoding.UTF8, "application/json"));
            await postAsync;

            postAsync.Result.EnsureSuccessStatusCode();

            var readResponse = postAsync.Result.Content.ReadAsStringAsync();
            await readResponse;

            var response = Utility.DeserializeFromJson<InternalMusicDataUpdateResponse>(readResponse.Result);
            return response;
        }
    }
}
