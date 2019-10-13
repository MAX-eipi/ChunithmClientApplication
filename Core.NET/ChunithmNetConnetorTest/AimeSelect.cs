using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IAimeSelectResponse AimeSelect(int index)
        {
            Console.WriteLine($"API: AimeSelect({index})");
            var aimeSelect = connector.SelectAimeAsync(index).Result;
            if (aimeSelect.Success)
            {
                Console.WriteLine(" Successful");
            }
            else
            {
                ShowCommonErrorMessage(aimeSelect);
            }

            return aimeSelect;
        }
    }
}
