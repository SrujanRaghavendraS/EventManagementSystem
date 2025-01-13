import React, { useState, useEffect } from 'react';

interface AddEventModalProps {
  onClose: () => void;
  onAddEvent: (newEvent: any) => void;
  userId: number;  // Accept userId from parent component
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onAddEvent, userId }) => {
  const [eventName, setEventName] = useState('');
  const [eventOrganiser, setEventOrganiser] = useState<number>(userId);  // Set organiser to passed userId
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventParticipants, setEventParticipants] = useState([0]); // Default participant list
  const [eventStatus, setEventStatus] = useState('Scheduled');  // Default status to 'Scheduled'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newEvent = {
      event_name: eventName,
      event_organiser: eventOrganiser,
      event_date: eventDate,
      event_time: eventTime,
      event_location: eventLocation,
      event_participants: eventParticipants,
      event_status: eventStatus,
    };
  
    try {
      // Call the FastAPI endpoint to create the event
      const response = await fetch('http://localhost:8000/events/create_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
  
      if (response.ok) {
        onAddEvent(newEvent); // Pass event data to parent component
        onClose(); // Close modal after adding event
        alert('Event created successfully!'); // Show alert on successful creation
      } else {
        console.error('Failed to add event');
      }
    } catch (error) {
      console.error('Error occurred while creating event', error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-2xl font-semibold text-center text-green-500 mb-6">Add New Event</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-white mb-2">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Event Organiser ID</label>
            <input
              type="number"
              value={eventOrganiser}
              disabled
              className="w-full p-2 rounded-lg text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Event Time</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Event Location</label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Event Participants (comma separated IDs)</label>
            <input
              type="text"
              value={eventParticipants.join(',')}
              onChange={(e) => setEventParticipants(e.target.value.split(',').map(id => Number(id.trim())))}
              className="w-full p-2 rounded-lg text-black"
              required
            />
          </div>
          <div className="mb-4 col-span-2">
            <label className="block text-white mb-2">Event Status</label>
            <select
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-between col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
