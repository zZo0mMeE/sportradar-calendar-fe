import { useState, useEffect } from 'react';
import type { SportEvent, EventsResponse } from '../types/event';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';
import CalendarHeader from '../components/CalendarHeader';
import CalendarGrid from '../components/CalendarGrid';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    events: SportEvent[];
}

const CalendarPage = () => {
    const [events, setEvents] = useState<SportEvent[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));

    useEffect(() => {
        fetch('/events.json')
            .then(response => response.json())
            .then((data: EventsResponse) => {
                setEvents(data.data);
            })
            .catch(error => console.error('Error loading events:', error));
    }, []);

    const getEventsForDate = (date: Date): SportEvent[] => {
        return events.filter(event => event.dateVenue === date.toISOString().split('T')[0]);
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const calendarDays: CalendarDay[] = [];

    const prevMonth = new Date(year, month - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        calendarDays.push({
            date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
            isCurrentMonth: false,
            events: []
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        calendarDays.push({
            date,
            isCurrentMonth: true,
            events: getEventsForDate(date)
        });
    }

    const remainingCells = 42 - calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
        const nextMonth = new Date(year, month + 1, day);
        calendarDays.push({
            date: nextMonth,
            isCurrentMonth: false,
            events: []
        });
    }

    const handleEventClick = (event: SportEvent) => {
        alert(`Event: ${event.originCompetitionName}\n${event.homeTeam?.name || 'TBD'} vs ${event.awayTeam.name}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <CalendarHeader
                    currentDate={currentDate}
                    onPreviousMonth={goToPreviousMonth}
                    onNextMonth={goToNextMonth}
                    onToday={goToToday}
                />
                <CalendarGrid days={calendarDays} onEventClick={handleEventClick} />
            </div>
        </div>
    );
};

export default CalendarPage;