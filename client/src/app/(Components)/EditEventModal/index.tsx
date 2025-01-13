import React, { useState, useEffect } from 'react';

const EditEvent = ({ eventId, onClose }: any) => {
  console.log(eventId); // This should print the passed eventId

  const [updatedEvent, setUpdatedEvent] = useState<any>({
    event_date: '',
    event_time: '',
    event_location: '',
    event_participants: [],
    event_status: '',
  });

  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);

  // Fetch the event data using the eventId
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8000/events/events/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setUpdatedEvent(data); // Initialize updated event data
        } else {
          console.error('Error fetching event:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedEvent((prevEvent: any) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const participants = value
      ? value.split(',').map((participant) => participant.trim())
      : [];
    setUpdatedEvent((prevEvent: any) => ({
      ...prevEvent,
      event_participants: participants,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/events/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        alert('Event updated successfully');
        onClose(); // Close the modal after saving
      } else {
        console.error('Error updating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:8000/events/events/${eventId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Event deleted successfully');
          onClose(); // Close the modal after deleting
        } else {
          console.error('Error deleting event:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-gray-600 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-2xl font-semibold text-black mb-6 text-center">Edit Event</h3>

        {/* Event Date Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">Event Date</label>
          <input
            type="date"
            name="event_date"
            value={updatedEvent.event_date || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Event Time Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">Event Time</label>
          <input
            type="time"
            name="event_time"
            value={updatedEvent.event_time || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Event Location Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">Event Location</label>
          <input
            type="text"
            name="event_location"
            value={updatedEvent.event_location || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Event Participants Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">Event Participants</label>
          <input
            type="text"
            name="event_participants"
            value={(updatedEvent.event_participants || []).join(', ') || ''}
            onChange={handleParticipantsChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Enter participants separated by commas"
          />
        </div>

        {/* Event Status Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">Event Status</label>
          <select
            name="event_status"
            value={updatedEvent.event_status || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
