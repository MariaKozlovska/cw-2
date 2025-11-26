import React from 'react';
import { Calendar as RBC, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Calendar({ events, onSelectSlot, onSelectEvent, view = 'month' }) {
  return (
    <div style={{ height: 600 }}>
      <RBC
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        defaultView={view}
        popup
      />
    </div>
  );
}
