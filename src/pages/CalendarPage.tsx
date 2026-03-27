import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';
import CalendarHeader from '../components/CalendarHeader';
import CalendarGrid from '../components/CalendarGrid';
import { useNavigate } from 'react-router-dom';
import type { SportEvent } from '../types/event';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    events: SportEvent[];
}

const CalendarPage = () => {
    const { events, loading } = useEvents();
    const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
    const navigate = useNavigate();

    const getEventsForDate = (date: Date): SportEvent[] => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.dateVenue === dateStr);
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
        navigate(`/event/${(event as any).id}`);
    };

    if (loading) return <div>Loading...</div>;

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