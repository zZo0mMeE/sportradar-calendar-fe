import type { SportEvent } from '../types/event';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    events: SportEvent[];
}

interface CalendarGridProps {
    days: CalendarDay[];
    onEventClick: (event: SportEvent) => void;
}

const CalendarGrid = ({ days, onEventClick }: CalendarGridProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-4 text-center font-medium text-gray-700">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`min-h-[120px] p-2 border-r border-b border-gray-100 ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                            }`}
                    >
                        <div
                            className={`text-sm font-medium mb-1 ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                }`}
                        >
                            {day.date.getDate()}
                        </div>

                        <div className="space-y-1">
                            {day.events.slice(0, 3).map((event, eventIndex) => (
                                <div
                                    key={eventIndex}
                                    className="w-2 h-2 bg-blue-500 rounded-full mx-auto cursor-pointer hover:bg-blue-700 transition-colors"
                                    title={`${event.originCompetitionName}: ${event.homeTeam?.name || 'TBD'} vs ${event.awayTeam.name}`}
                                    onClick={() => onEventClick(event)}
                                />
                            ))}
                            {day.events.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">
                                    +{day.events.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarGrid;
