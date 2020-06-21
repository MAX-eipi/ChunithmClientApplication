namespace ChunithmClientLibrary
{
    public enum ChainStatus
    {
        None,
        FullChainGold,
        FullChainPlatinum,
    }

    public static partial class Utility
    {
        public static readonly string CHAIN_STATUS_NONE_TEXT = "NONE";
        public static readonly string CHAIN_STATUS_FULL_CHAIN_GOLD_TEXT = "FULL CHAIN 2";
        public static readonly string CHAIN_STATUS_FULL_CHAIN_PLATINUM_TEXT = "FULL CHAIN";

        private class ChainStatusPair
        {
            public ChainStatus ChainStatus { get; }
            public string Text { get; }

            public ChainStatusPair(ChainStatus chainStatus, string text)
            {
                ChainStatus = chainStatus;
                Text = text;
            }
        }

        private static ChainStatusPair[] chainStatusPairs = new ChainStatusPair[]
        {
            new ChainStatusPair(ChainStatus.None, CHAIN_STATUS_NONE_TEXT),
            new ChainStatusPair(ChainStatus.FullChainGold, CHAIN_STATUS_FULL_CHAIN_GOLD_TEXT),
            new ChainStatusPair(ChainStatus.FullChainPlatinum, CHAIN_STATUS_FULL_CHAIN_PLATINUM_TEXT),
        };

        public static ChainStatus ToChainStatus(string chainStatusText)
        {
            return PairConverter.Convert(chainStatusPairs, chainStatusText, ChainStatus.None, p => p.Text, p => p.ChainStatus);
        }

        public static string ToChainStatusText(ChainStatus chainStatus)
        {
            return PairConverter.Convert(chainStatusPairs, chainStatus, CHAIN_STATUS_NONE_TEXT, p => p.ChainStatus, p => p.Text);
        }
    }
}
