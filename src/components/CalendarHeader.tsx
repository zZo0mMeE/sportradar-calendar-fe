interface CalendarHeaderProps {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

const CalendarHeader = ({
    currentDate,
    onPreviousMonth,
    onNextMonth,
    onToday
}: CalendarHeaderProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                <div className="text-lg font-semibold text-gray-800">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={onPreviousMonth}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors">
                        ← Previous
                    </button>
                    <button
                        onClick={onToday}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Today
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors">
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarHeader;
