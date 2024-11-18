export function JournalPanel({
    logs
}: {
    logs: string[]
}) {
    return (
        <div className="grow">
            <div className="text-center font-bold text-sm">Журнал</div>
            <div className="bg-gray-50 w-full rounded-md h-[25rem] overflow-auto">
                {logs.map((log: string, index: number) => (
                    <div key={index} className="text-xs">{log}</div>
                ))}
            </div>
        </div>
    );
}