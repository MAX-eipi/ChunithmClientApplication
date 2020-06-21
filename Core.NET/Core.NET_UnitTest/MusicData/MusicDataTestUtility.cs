using ChunithmClientLibrary;
using ChunithmClientLibrary.MusicData;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace ChunithmClientLibraryUnitTest.MusicData
{
    public static class MusicDataTestUtility
    {
        public static void AreEqual(IMusicDataTable<IMusicDataTableUnit> expected, IMusicDataTable<IMusicDataTableUnit> actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            var expectedTableUnits = expected.GetTableUnits().ToList();
            var actualTableUnits = actual.GetTableUnits().ToList();
            Assert.IsNotNull(expectedTableUnits, "expected.GetTableUnits()");
            Assert.IsNotNull(actualTableUnits, "actual.GetTableUnits()");
            Assert.AreEqual(expectedTableUnits.Count, actualTableUnits.Count, "件数");

            var count = expectedTableUnits.Count;
            for (var i = 0; i < count; i++)
            {
                AreEqual(expectedTableUnits[i], actualTableUnits[i]);
            }
        }

        public static void AreEqual(IMusicDataTableUnit expected, IMusicDataTableUnit actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            Assert.AreEqual(expected.Id, actual.Id, "楽曲ID");
            Assert.AreEqual(expected.Name, actual.Name, "楽曲名");
            Assert.AreEqual(expected.Genre, actual.Genre, "ジャンル");

            var difficulties = new[] { Difficulty.Basic, Difficulty.Advanced, Difficulty.Expert, Difficulty.Master };
            for (var i = 0; i < difficulties.Length; i++)
            {
                Assert.AreEqual(expected.GetBaseRating(difficulties[i]), actual.GetBaseRating(difficulties[i]), $"{difficulties[i]}譜面定数");
                Assert.AreEqual(expected.VerifiedBaseRating(difficulties[i]), actual.VerifiedBaseRating(difficulties[i]), $"{difficulties[i]}検証");
            }
        }
    }
}
