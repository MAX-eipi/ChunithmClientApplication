namespace ChunithmClientLibrary
{
    public enum WorldsEndType
    {
        Invalid,
        招,
        狂,
        止,
        改,
        両,
        嘘,
        半,
        時,
        光,
        割,
        跳,
        弾,
        戻,
        伸,
        布,
        敷,
        翔,
        謎,
        疑, // ?
        驚, // !
        避,
        速,
        歌,
        没,
        舞,
        俺,
        蔵,
        覚,
    }

    public static partial class Utility
    {
        public static readonly string WORLDS_END_TYPE_INVALID_TEXT = "INVALID";
        public static readonly string WORLDS_END_TYPE_招_TEXT = "招";
        public static readonly string WORLDS_END_TYPE_狂_TEXT = "狂";
        public static readonly string WORLDS_END_TYPE_止_TEXT = "止";
        public static readonly string WORLDS_END_TYPE_改_TEXT = "改";
        public static readonly string WORLDS_END_TYPE_両_TEXT = "両";
        public static readonly string WORLDS_END_TYPE_嘘_TEXT = "嘘";
        public static readonly string WORLDS_END_TYPE_半_TEXT = "半";
        public static readonly string WORLDS_END_TYPE_時_TEXT = "時";
        public static readonly string WORLDS_END_TYPE_光_TEXT = "光";
        public static readonly string WORLDS_END_TYPE_割_TEXT = "割";
        public static readonly string WORLDS_END_TYPE_跳_TEXT = "跳";
        public static readonly string WORLDS_END_TYPE_弾_TEXT = "弾";
        public static readonly string WORLDS_END_TYPE_戻_TEXT = "戻";
        public static readonly string WORLDS_END_TYPE_伸_TEXT = "伸";
        public static readonly string WORLDS_END_TYPE_布_TEXT = "布";
        public static readonly string WORLDS_END_TYPE_敷_TEXT = "敷";
        public static readonly string WORLDS_END_TYPE_翔_TEXT = "翔";
        public static readonly string WORLDS_END_TYPE_謎_TEXT = "謎";
        public static readonly string WORLDS_END_TYPE_疑_TEXT = "？";
        public static readonly string WORLDS_END_TYPE_驚_TEXT = "！";
        public static readonly string WORLDS_END_TYPE_避_TEXT = "避";
        public static readonly string WORLDS_END_TYPE_速_TEXT = "速";
        public static readonly string WORLDS_END_TYPE_歌_TEXT = "歌";
        public static readonly string WORLDS_END_TYPE_没_TEXT = "没";
        public static readonly string WORLDS_END_TYPE_舞_TEXT = "舞";
        public static readonly string WORLDS_END_TYPE_俺_TEXT = "俺";
        public static readonly string WORLDS_END_TYPE_蔵_TEXT = "蔵";
        public static readonly string WORLDS_END_TYPE_覚_TEXT = "覚";

        public static readonly int WORLDS_END_TYPE_INVALID_CODE = -1;
        public static readonly int WORLDS_END_TYPE_招_CODE = 1;
        public static readonly int WORLDS_END_TYPE_狂_CODE = 2;
        public static readonly int WORLDS_END_TYPE_止_CODE = 3;
        public static readonly int WORLDS_END_TYPE_改_CODE = 4;
        public static readonly int WORLDS_END_TYPE_両_CODE = 5;
        public static readonly int WORLDS_END_TYPE_嘘_CODE = 6;
        public static readonly int WORLDS_END_TYPE_半_CODE = 7;
        public static readonly int WORLDS_END_TYPE_時_CODE = 8;
        public static readonly int WORLDS_END_TYPE_光_CODE = 9;
        public static readonly int WORLDS_END_TYPE_割_CODE = 10;
        public static readonly int WORLDS_END_TYPE_跳_CODE = 11;
        public static readonly int WORLDS_END_TYPE_弾_CODE = 12;
        public static readonly int WORLDS_END_TYPE_戻_CODE = 13;
        public static readonly int WORLDS_END_TYPE_伸_CODE = 14;
        public static readonly int WORLDS_END_TYPE_布_CODE = 15;
        public static readonly int WORLDS_END_TYPE_敷_CODE = 16;
        public static readonly int WORLDS_END_TYPE_翔_CODE = 17;
        public static readonly int WORLDS_END_TYPE_謎_CODE = 18;
        public static readonly int WORLDS_END_TYPE_疑_CODE = 19;
        public static readonly int WORLDS_END_TYPE_驚_CODE = 20;
        public static readonly int WORLDS_END_TYPE_避_CODE = 21;
        public static readonly int WORLDS_END_TYPE_速_CODE = 22;
        public static readonly int WORLDS_END_TYPE_歌_CODE = 23;
        public static readonly int WORLDS_END_TYPE_没_CODE = 24;
        public static readonly int WORLDS_END_TYPE_舞_CODE = 25;
        public static readonly int WORLDS_END_TYPE_俺_CODE = 26;
        public static readonly int WORLDS_END_TYPE_蔵_CODE = 27;
        public static readonly int WORLDS_END_TYPE_覚_CODE = 28;

        private class WorldsEndTypePair
        {
            public WorldsEndType WorldsEndType { get; set; }
            public string Text { get; set; }
            public int Code { get; set; }

            public WorldsEndTypePair(WorldsEndType worldsEndType, string text, int code)
            {
                WorldsEndType = worldsEndType;
                Text = text;
                Code = code;
            }
        }

        private static WorldsEndTypePair[] worldsEndTypePairs = new WorldsEndTypePair[]
        {
            new WorldsEndTypePair(WorldsEndType.Invalid, WORLDS_END_TYPE_INVALID_TEXT, WORLDS_END_TYPE_INVALID_CODE),
            new WorldsEndTypePair(WorldsEndType.招, WORLDS_END_TYPE_招_TEXT, WORLDS_END_TYPE_招_CODE),
            new WorldsEndTypePair(WorldsEndType.狂, WORLDS_END_TYPE_狂_TEXT, WORLDS_END_TYPE_狂_CODE),
            new WorldsEndTypePair(WorldsEndType.止, WORLDS_END_TYPE_止_TEXT, WORLDS_END_TYPE_止_CODE),
            new WorldsEndTypePair(WorldsEndType.改, WORLDS_END_TYPE_改_TEXT, WORLDS_END_TYPE_改_CODE),
            new WorldsEndTypePair(WorldsEndType.両, WORLDS_END_TYPE_両_TEXT, WORLDS_END_TYPE_両_CODE),
            new WorldsEndTypePair(WorldsEndType.嘘, WORLDS_END_TYPE_嘘_TEXT, WORLDS_END_TYPE_嘘_CODE),
            new WorldsEndTypePair(WorldsEndType.半, WORLDS_END_TYPE_半_TEXT, WORLDS_END_TYPE_半_CODE),
            new WorldsEndTypePair(WorldsEndType.時, WORLDS_END_TYPE_時_TEXT, WORLDS_END_TYPE_時_CODE),
            new WorldsEndTypePair(WorldsEndType.光, WORLDS_END_TYPE_光_TEXT, WORLDS_END_TYPE_光_CODE),
            new WorldsEndTypePair(WorldsEndType.割, WORLDS_END_TYPE_割_TEXT, WORLDS_END_TYPE_割_CODE),
            new WorldsEndTypePair(WorldsEndType.跳, WORLDS_END_TYPE_跳_TEXT, WORLDS_END_TYPE_跳_CODE),
            new WorldsEndTypePair(WorldsEndType.弾, WORLDS_END_TYPE_弾_TEXT, WORLDS_END_TYPE_弾_CODE),
            new WorldsEndTypePair(WorldsEndType.戻, WORLDS_END_TYPE_戻_TEXT, WORLDS_END_TYPE_戻_CODE),
            new WorldsEndTypePair(WorldsEndType.伸, WORLDS_END_TYPE_伸_TEXT, WORLDS_END_TYPE_伸_CODE),
            new WorldsEndTypePair(WorldsEndType.布, WORLDS_END_TYPE_布_TEXT, WORLDS_END_TYPE_布_CODE),
            new WorldsEndTypePair(WorldsEndType.敷, WORLDS_END_TYPE_敷_TEXT, WORLDS_END_TYPE_敷_CODE),
            new WorldsEndTypePair(WorldsEndType.翔, WORLDS_END_TYPE_翔_TEXT, WORLDS_END_TYPE_翔_CODE),
            new WorldsEndTypePair(WorldsEndType.謎, WORLDS_END_TYPE_謎_TEXT, WORLDS_END_TYPE_謎_CODE),
            new WorldsEndTypePair(WorldsEndType.疑, WORLDS_END_TYPE_疑_TEXT, WORLDS_END_TYPE_疑_CODE),
            new WorldsEndTypePair(WorldsEndType.驚, WORLDS_END_TYPE_驚_TEXT, WORLDS_END_TYPE_驚_CODE),
            new WorldsEndTypePair(WorldsEndType.避, WORLDS_END_TYPE_避_TEXT, WORLDS_END_TYPE_避_CODE),
            new WorldsEndTypePair(WorldsEndType.速, WORLDS_END_TYPE_速_TEXT, WORLDS_END_TYPE_速_CODE),
            new WorldsEndTypePair(WorldsEndType.歌, WORLDS_END_TYPE_歌_TEXT, WORLDS_END_TYPE_歌_CODE),
            new WorldsEndTypePair(WorldsEndType.没, WORLDS_END_TYPE_没_TEXT, WORLDS_END_TYPE_没_CODE),
            new WorldsEndTypePair(WorldsEndType.舞, WORLDS_END_TYPE_舞_TEXT, WORLDS_END_TYPE_舞_CODE),
            new WorldsEndTypePair(WorldsEndType.俺, WORLDS_END_TYPE_俺_TEXT, WORLDS_END_TYPE_俺_CODE),
            new WorldsEndTypePair(WorldsEndType.蔵, WORLDS_END_TYPE_蔵_TEXT, WORLDS_END_TYPE_蔵_CODE),
            new WorldsEndTypePair(WorldsEndType.覚, WORLDS_END_TYPE_覚_TEXT, WORLDS_END_TYPE_覚_CODE),
        };

        public static int ToWorldsEndTypeCode(WorldsEndType worldsEndType)
        {
            return PairConverter.Convert(worldsEndTypePairs, worldsEndType, WORLDS_END_TYPE_INVALID_CODE, p => p.WorldsEndType, p => p.Code);
        }

        public static WorldsEndType ToWorldsEndType(int worldsEndTypeCode)
        {
            return PairConverter.Convert(worldsEndTypePairs, worldsEndTypeCode, WorldsEndType.Invalid, p => p.Code, p => p.WorldsEndType);
        }
    }
}
