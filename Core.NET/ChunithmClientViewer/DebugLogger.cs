using System;
using System.Diagnostics;

namespace ChunithmClientViewer
{
    public static class DebugLogger
    {
        [Conditional("DEBUG")]
        public static void WriteLine(string format, params object[] args)
        {
            Console.WriteLine(format, args);
        }
    }
}
