using ChunithmClientLibrary.PlayerRecord;
using ChunithmClientLibraryUnitTest.HighScoreRecord;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.PlayerReocrd
{
    public static class PlayerRecordTestUtility
    {
        public static void AreEqual(IPlayerRecordContainer expected, IPlayerRecordContainer actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            HighScoreRecordTestUtility.AreEqual(expected.Basic, actual.Basic);
            HighScoreRecordTestUtility.AreEqual(expected.Advanced, actual.Advanced);
            HighScoreRecordTestUtility.AreEqual(expected.Expert, actual.Expert);
            HighScoreRecordTestUtility.AreEqual(expected.Master, actual.Master);
        }
    }
}
