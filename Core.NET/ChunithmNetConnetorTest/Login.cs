using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static ILoginResponse Login(string segaId, string password)
        {
            Console.WriteLine($"API: Login({segaId}, {password})");
            var login = connector.LoginAsync(segaId, password).Result;
            if (login.Success)
            {
                Console.WriteLine(" Successful");

                for (var i = 0; i < login.AimeList.Units.Length; i++)
                {
                    var aimeInfo = login.AimeList.Units[i];
                    Console.WriteLine($" Aime Info {i}");
                    Console.WriteLine($"  Lv.{aimeInfo.Level}:{aimeInfo.Name}");
                    Console.WriteLine($"  Rating:{aimeInfo.NowRating}(Max:{aimeInfo.MaxRating})");
                    Console.WriteLine($"  {aimeInfo.VoucherText}");
                }
            }
            else
            {
                ShowCommonErrorMessage(login);
            }

            return login;
        }
    }
}
