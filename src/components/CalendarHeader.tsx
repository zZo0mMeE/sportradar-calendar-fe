import { Link } from "react-router-dom";

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
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Sports Calendar</h1>
                <Link to="/add-event" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Add Event
                </Link>
                <button
                    onClick={onToday}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Today
                </button>
            </div>
            <div className="flex items-center justify-between">
                <button
                    onClick={onPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    ← Previous
                </button>

                <h2 className="text-xl font-semibold text-gray-800">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                    onClick={onNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    Next →
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;
