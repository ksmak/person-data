import { SecondaryBtn } from "../buttons";

export function JournalPanel({
    logs
}: {
    logs: string[]
}) {
    const handleClick = async () => {
        await navigator.clipboard.writeText(logs.join(""));
        alert('Данные скопированы в буфер обмена.');
    };

    return (
        <div className="grow">
            <div className="grid grid-cols-3 w-full">
                <div className="col-start-2 self-center text-center font-bold text-sm">
                    Журнал
                </div>
                {logs.length > 0 && <SecondaryBtn
                    className="justify-self-end rounded-xl"
                    onClick={handleClick}
                >
                    Копировать
                </SecondaryBtn>}
            </div>
            <div className="mt-4 bg-secondary w-full rounded-md h-[24rem] overflow-auto">
                {logs.map((log: string, index: number) => (
                    <pre key={index} className="text-sm font-sans font-normal">{log}</pre>
                ))}
            </div>
        </div>
    );
}