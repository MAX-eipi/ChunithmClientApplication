using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    [DataContract]
    public class ChunithmMusicDatabaseApiRequest
    {
    }

    [DataContract]
    public class ChunithmMusicDatabaseApiResponse
    {
        [DataMember]
        public bool Success { get; set; }
    }
}
