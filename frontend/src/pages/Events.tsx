import React, { useState } from 'react';
import '../styles/login.css';

interface EventItem {
  title: string;
  date: string;
  time: string;
  location: string;
  speaker: string;
}

const Events = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    speaker: '',
  });

  const handleDayClick = (fullDate: string) => {
    setSelectedDate(fullDate);
  };

  const saveEvent = () => {
    if (!formData.title || !formData.date) return;
    setEvents([...events, { ...formData }]);
    setShowModal(false);
    setFormData({ title: '', date: '', time: '', location: '', speaker: '' });
  };

  const deleteEvent = (event: EventItem) => {
    setEvents(events.filter(e => e !== event));
  };

  const filteredEvents = selectedDate
    ? events.filter(e => e.date === selectedDate)
    : [];

  return (
    <>
      <div className="calendar-title">
        <h2>Events Calendar</h2>
        <p className="login-subtext">Your builder timeline from coffee chats to Series A</p>
      </div>

      <div className="toolbar-controls">
        <div className="left">
          <button onClick={() => {
            setFormData(prev => ({ ...prev, date: selectedDate || `${year}-01-01` }));
            setShowModal(true);
          }}>+ Add Event</button>
        </div>
        <div className="right year-nav">
          <button onClick={() => setYear(y => y - 1)}>←</button>
          <span>{year}</span>
          <button onClick={() => setYear(y => y + 1)}>→</button>
        </div>
      </div>

      <div className="event-layout">
        {/* Left side: Calendar */}
        <div className="calendar-side">
          <div className="calendar-year-grid">
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date(year, i, 1);
              const month = date.toLocaleString('default', { month: 'long' });
              const daysInMonth = new Date(year, i + 1, 0).getDate();
              const firstDay = new Date(year, i, 1).getDay();

              const fullCells = Array(firstDay).fill(null).concat(
                Array.from({ length: daysInMonth }, (_, d) => {
                  const day = d + 1;
                  const fullDate = `${year}-${String(i + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const hasEvent = events.some(e => e.date === fullDate);
                  const isSelected = selectedDate === fullDate;

                  return (
                    <div
                      key={day}
                      className={`calendar-cell ${hasEvent ? 'has-event' : ''} ${isSelected ? 'selected-date' : ''}`}
                      onClick={() => handleDayClick(fullDate)}
                    >
                      {day}
                    </div>
                  );
                })
              );

              return (
                <div key={i} className="month-container">
                  <h3>{month}</h3>
                  <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                      <div key={i} className="calendar-day-name">{d}</div>
                    ))}
                    {fullCells.map((cell, i) =>
                      cell ? cell : <div key={`empty-${i}`} className="calendar-cell" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: Event list */}
        <div className="events-side">
          <h3>
            Events on {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }) : '[Select a date]'}
          </h3>
          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            filteredEvents.map((event, idx) => (
              <div key={idx} className="event-card">
                <h4>{event.title}</h4>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Speaker:</strong> {event.speaker}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <button className="delete-btn" onClick={() => deleteEvent(event)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Event — {formData.date}</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              type="time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="Speaker"
              value={formData.speaker}
              onChange={e => setFormData({ ...formData, speaker: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={saveEvent}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Events;
