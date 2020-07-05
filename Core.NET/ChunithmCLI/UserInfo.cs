using System.Runtime.Serialization;

namespace ChunithmCLI
{
    [DataContract]
    public class UserInfo
    {
        [DataMember]
        private string segaId = "";
        [IgnoreDataMember]
        public string SegaId => segaId;

        [DataMember]
        private string password = "";
        [IgnoreDataMember]
        public string Password => password;

        [DataMember]
        private int aimeIndex = 0;
        [IgnoreDataMember]
        public int AimeIndex => aimeIndex;
    }
}
