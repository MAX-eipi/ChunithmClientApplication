using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class GenreTest
    {
        [TestMethod]
        public void Genre_GenreTextToGenre_Test1()
        {
            Assert.AreEqual(Genre.POPS_AND_ANIME, Utility.ToGenre("POPS & ANIME"), "POPS & ANIME");
            Assert.AreEqual(Genre.niconico, Utility.ToGenre("niconico"), "niconico");
            Assert.AreEqual(Genre.東方Project, Utility.ToGenre("東方Project"), "東方Project");
            Assert.AreEqual(Genre.VARIETY, Utility.ToGenre("VARIETY"), "VARIETY");
            Assert.AreEqual(Genre.イロドリミドリ, Utility.ToGenre("イロドリミドリ"), "イロドリミドリ");
            Assert.AreEqual(Genre.言ノ葉Project, Utility.ToGenre("言ノ葉Project"), "言ノ葉Project");
            Assert.AreEqual(Genre.ORIGINAL, Utility.ToGenre("ORIGINAL"), "ORIGINAL");
            Assert.AreEqual(Genre.All, Utility.ToGenre("ALL"), "ALL");

            Assert.AreEqual(Genre.Invalid, Utility.ToGenre(null));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre(""));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("INVALID"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("pops & anime"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("NICONICO"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("東方project"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("variety"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("いろどりみどり"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("言ノ葉project"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("original"));
            Assert.AreEqual(Genre.Invalid, Utility.ToGenre("all"));
        }

        [TestMethod]
        public void Genre_GenreToGenreText_Test1()
        {
            Assert.AreEqual("POPS & ANIME", Utility.ToGenreText(Genre.POPS_AND_ANIME), "POPS & ANIME");
            Assert.AreEqual("niconico", Utility.ToGenreText(Genre.niconico), "niconico");
            Assert.AreEqual("東方Project", Utility.ToGenreText(Genre.東方Project), "東方Project");
            Assert.AreEqual("VARIETY", Utility.ToGenreText(Genre.VARIETY), "VARIETY");
            Assert.AreEqual("イロドリミドリ", Utility.ToGenreText(Genre.イロドリミドリ), "イロドリミドリ");
            Assert.AreEqual("言ノ葉Project", Utility.ToGenreText(Genre.言ノ葉Project), "言ノ葉Project");
            Assert.AreEqual("ORIGINAL", Utility.ToGenreText(Genre.ORIGINAL), "ORIGINAL");
            Assert.AreEqual("ALL", Utility.ToGenreText(Genre.All), "ALL");
            Assert.AreEqual("INVALID", Utility.ToGenreText(Genre.Invalid), "INVALID");

            Assert.AreEqual("INVALID", Utility.ToGenreText((Genre)(-2)));
            Assert.AreEqual("INVALID", Utility.ToGenreText((Genre)(10)));
        }

        [TestMethod]
        public void Genre_GenreToGenreCode_Test1()
        {
            Assert.AreEqual(0, Utility.ToGenreCode(Genre.POPS_AND_ANIME), "POPS & ANIME");
            Assert.AreEqual(2, Utility.ToGenreCode(Genre.niconico), "niconico");
            Assert.AreEqual(3, Utility.ToGenreCode(Genre.東方Project), "東方Project");
            Assert.AreEqual(6, Utility.ToGenreCode(Genre.VARIETY), "VARIETY");
            Assert.AreEqual(7, Utility.ToGenreCode(Genre.イロドリミドリ), "イロドリミドリ");
            Assert.AreEqual(8, Utility.ToGenreCode(Genre.言ノ葉Project), "言ノ葉Project");
            Assert.AreEqual(5, Utility.ToGenreCode(Genre.ORIGINAL), "ORIGINAL");
            Assert.AreEqual(99, Utility.ToGenreCode(Genre.All), "ALL");
            Assert.AreEqual(-1, Utility.ToGenreCode(Genre.Invalid), "INVALID");

            Assert.AreEqual(-1, Utility.ToGenreCode((Genre)(-2)));
            Assert.AreEqual(-1, Utility.ToGenreCode((Genre)(10)));
        }
    }
}
