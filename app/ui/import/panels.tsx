export function JournalPanel({
    logs
}: {
    logs: string[]
}) {
    return (
        <div className="grow flex-col justify-center rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="font-bold uppercase text-center p-2 w-full mb-4 h-5 text-sm">Журнал</div>
            <div className="h-[500px] overflow-auto">
                {logs.map((log: string, index: number) => (
                    <div key={index} className="text-xs">{log}</div>
                ))}
            </div>
        </div>
    );
}