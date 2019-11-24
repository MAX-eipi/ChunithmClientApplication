using System;

namespace ChunithmCLI
{
    class Program
    {
        static void Main(string[] args)
        {
            var command = new GenreGet();
            if (command.Called(args))
            {
                command.Call(args);
            }
        }
    }
}
