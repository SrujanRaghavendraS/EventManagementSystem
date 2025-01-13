import React from 'react';

type EventModalProps = {
  event: any;
  userNames: { [key: number]: string };
  onClose: () => void;
};

const EventModal = ({ event, userNames, onClose }: EventModalProps) => {
  const calculateDaysLeft = (eventDate: string) => {
    const eventDateObj = new Date(eventDate);
    const currentDate = new Date();
    const differenceInTime = eventDateObj.getTime() - currentDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
  };

  return (
    <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-gray-900 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-white">{event.event_name}</h2>
        <p className="text-gray-300">{event.event_location}</p>
        <p className="text-gray-300">Event Date: {new Date(event.event_date).toLocaleDateString()}</p>
        <p className="text-gray-300">Event Time: {event.event_time}</p> {/* Event Time */}
        <p className="text-gray-300">Days Left: {calculateDaysLeft(event.event_date)}</p>
        <p className="text-gray-300">
          Organizer: {userNames[event.event_organiser] || 'Loading...'}
        </p>
        <p className="text-gray-300">Event Status: {event.event_status}</p>
        <p className="text-gray-300">
          Participants: {event.event_participants.length}
        </p>
        <p className="text-gray-300">{event.event_description}</p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventModal;
