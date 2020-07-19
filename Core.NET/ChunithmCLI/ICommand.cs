namespace ChunithmCLI
{
    public interface ICommand
    {
        string GetCommandName();
        bool Called(string[] args);
        void Call(string[] args);
    }
}
