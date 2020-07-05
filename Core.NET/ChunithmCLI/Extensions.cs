using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.ChunithmNet.API;
using System;
using System.Threading.Tasks;

namespace ChunithmCLI
{
    public static class Extensions
    {
        public static TResponse GetNetApiResult<TResponse>(this Task<TResponse> request, string message, bool showSuccess = true)
            where TResponse : IChunithmNetApiResponse
        {
            Console.WriteLine(message);

            var response = request.Result;
            if (response.Success)
            {
                if (showSuccess)
                {
                    Console.WriteLine("success.");
                }
            }
            else
            {
                Console.WriteLine("failure.");
                Console.WriteLine("[Error Code]");
                Console.WriteLine(response.ErrorCode);
                Console.WriteLine("[Error Message]");
                Console.WriteLine(response.ErrorMessage);
                throw new ApplicationException();
            }
            return response;
        }

        public static TResponse GetMusicDatabaseApiResult<TResponse>(this Task<TResponse> request, string message)
            where TResponse : IChunithmMusicDatabaseApiResponse
        {
            Console.WriteLine(message);

            var result = request.Result;
            if (result.Success)
            {
                Console.WriteLine("success.");
            }
            else
            {
                Console.WriteLine("failure.");
                throw new ApplicationException();
            }
            return result;
        }
    }
}
