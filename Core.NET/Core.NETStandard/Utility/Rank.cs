namespace ChunithmClientLibrary
{
    public enum Rank
    {
        None,
        D,
        C,
        B,
        BB,
        BBB,
        A,
        AA,
        AAA,
        S,
        SS,
        SSA,
        SSS,
        Max,
    }

    public static partial class Utility
    {
        public static readonly int RANK_MAX_BORDER_SCORE = 1010000;
        public static readonly int RANK_SSS_BORDER_SCORE = 1007500;
        public static readonly int RANK_SSA_BORDER_SCORE = 1005000;
        public static readonly int RANK_SS_BORDER_SCORE = 1000000;
        public static readonly int RANK_S_BORDER_SCORE = 975000;
        public static readonly int RANK_AAA_BORDER_SCORE = 950000;
        public static readonly int RANK_AA_BORDER_SCORE = 925000;
        public static readonly int RANK_A_BORDER_SCOER = 900000;
        public static readonly int RANK_BBB_BORDER_SCORE = 800000;
        public static readonly int RANK_BB_BORDER_SCORE = 700000;
        public static readonly int RANK_B_BORDER_SCORE = 600000;
        public static readonly int RANK_C_BORDER_SCORE = 500000;
        public static readonly int RANK_D_BORDER_SCORE = 0;
        public static readonly int RANK_NONE_BORDER_SCORE = 0;

        public static readonly string RANK_MAX_TEXT = "MAX";
        public static readonly string RANK_SSS_TEXT = "SSS";
        public static readonly string RANK_SSA_TEXT = "SS+";
        public static readonly string RANK_SS_TEXT = "SS";
        public static readonly string RANK_S_TEXT = "S";
        public static readonly string RANK_AAA_TEXT = "AAA";
        public static readonly string RANK_AA_TEXT = "AA";
        public static readonly string RANK_A_TEXT = "A";
        public static readonly string RANK_BBB_TEXT = "BBB";
        public static readonly string RANK_BB_TEXT = "BB";
        public static readonly string RANK_B_TEXT = "B";
        public static readonly string RANK_C_TEXT = "C";
        public static readonly string RANK_D_TEXT = "D";
        public static readonly string RANK_NONE_TEXT = "NONE";

        public static readonly int RANK_MAX_CODE = 10;
        public static readonly int RANK_SSS_CODE = 10;
        public static readonly int RANK_SSA_CODE = 9;
        public static readonly int RANK_SS_CODE = 9;
        public static readonly int RANK_S_CODE = 8;
        public static readonly int RANK_AAA_CODE = 7;
        public static readonly int RANK_AA_CODE = 6;
        public static readonly int RANK_A_CODE = 5;
        public static readonly int RANK_BBB_CODE = 4;
        public static readonly int RANK_BB_CODE = 3;
        public static readonly int RANK_B_CODE = 2;
        public static readonly int RANK_C_CODE = 1;
        public static readonly int RANK_D_CODE = 0;
        public static readonly int RANK_NONE_CODE = -1;

        private class RankPair
        {
            public Rank Rank { get; }
            public int Score { get; }
            public string Text { get; }
            public int Code { get; }

            public RankPair(Rank rank, int score, string text, int code)
            {
                Rank = rank;
                Score = score;
                Text = text;
                Code = code;
            }
        }

        private static RankPair[] rankPairs = new RankPair[]
        {
            new RankPair(Rank.Max, RANK_MAX_BORDER_SCORE, RANK_MAX_TEXT, RANK_MAX_CODE),
            new RankPair(Rank.SSS, RANK_SSS_BORDER_SCORE, RANK_SSS_TEXT, RANK_SSS_CODE),
            new RankPair(Rank.SSA, RANK_SSA_BORDER_SCORE, RANK_SSA_TEXT, RANK_SSA_CODE),
            new RankPair(Rank.SS, RANK_SS_BORDER_SCORE, RANK_SS_TEXT, RANK_SS_CODE),
            new RankPair(Rank.S, RANK_S_BORDER_SCORE, RANK_S_TEXT, RANK_S_CODE),
            new RankPair(Rank.AAA, RANK_AAA_BORDER_SCORE, RANK_AAA_TEXT, RANK_AAA_CODE),
            new RankPair(Rank.AA, RANK_AA_BORDER_SCORE, RANK_AA_TEXT, RANK_AA_CODE),
            new RankPair(Rank.A, RANK_A_BORDER_SCOER, RANK_A_TEXT, RANK_A_CODE),
            new RankPair(Rank.BBB, RANK_BBB_BORDER_SCORE, RANK_BBB_TEXT, RANK_BBB_CODE),
            new RankPair(Rank.BB, RANK_BB_BORDER_SCORE, RANK_BB_TEXT, RANK_BB_CODE),
            new RankPair(Rank.B, RANK_B_BORDER_SCORE, RANK_B_TEXT, RANK_B_CODE),
            new RankPair(Rank.C, RANK_C_BORDER_SCORE, RANK_C_TEXT, RANK_C_CODE),
            new RankPair(Rank.D, RANK_D_BORDER_SCORE, RANK_D_TEXT, RANK_D_CODE),
            new RankPair(Rank.None, RANK_NONE_BORDER_SCORE, RANK_NONE_TEXT, RANK_NONE_CODE),
        };

        public static int GetBorderScore(Rank rank)
        {
            return PairConverter.Convert(rankPairs, rank, RANK_NONE_BORDER_SCORE, p => p.Rank, p => p.Score);
        }

        public static Rank GetRank(int score)
        {
            return PairConverter.Convert(rankPairs, score, Rank.None, p => p.Score, p => p.Rank, value => score >= value);
        }

        public static Rank ToRank(int rankCode)
        {
            if (rankCode == 10)
            {
                return Rank.SSS;
            }

            if (rankCode == 9)
            {
                return Rank.SS;
            }

            return PairConverter.Convert(rankPairs, rankCode, Rank.None, p => p.Code, p => p.Rank);
        }

        public static Rank ToRank(string rankText)
        {
            return PairConverter.Convert(rankPairs, rankText, Rank.None, p => p.Text, p => p.Rank);
        }

        public static string ToRankText(Rank rank)
        {
            return PairConverter.Convert(rankPairs, rank, RANK_NONE_TEXT, p => p.Rank, p => p.Text);
        }

        public static int ToRankCode(Rank rank)
        {
            return PairConverter.Convert(rankPairs, rank, RANK_NONE_CODE, p => p.Rank, p => p.Code);
        }

        public static int ToRankCode(string rankText)
        {
            return PairConverter.Convert(rankPairs, rankText, RANK_NONE_CODE, p => p.Text, p => p.Code);
        }
    }
}
