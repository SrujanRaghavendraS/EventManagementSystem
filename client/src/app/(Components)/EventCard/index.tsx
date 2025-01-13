import React, { useState } from 'react';
import TaskTrackerModal from '@/app/(Components)/TaskTrackerModal'; // Assuming the modal is in the same directory

const EventCard = ({
  event,
  userNames,
  onViewMore,
  onEdit,
  userIdInt,
}: {
  event: any;
  userNames: { [key: number]: string };
  onViewMore: (event: any) => void;
  onEdit: (event: any) => void;
  userIdInt: number | null;
}) => {
  const [isTaskTrackerOpen, setTaskTrackerOpen] = useState(false);

  const handleViewTaskStatus = () => {
    setTaskTrackerOpen(true); // Open modal
  };

  const closeTaskTracker = () => {
    setTaskTrackerOpen(false); // Close modal
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-white">{event.event_name}</h3>
      <p className="text-gray-400 text-sm">{event.event_location}</p>
      <p className="text-gray-400 text-sm">Days Left: {calculateDaysLeft(event.event_date)}</p>
      <p className="text-gray-400 text-sm">{event.event_description}</p>
      <p className="text-gray-400 text-sm">Event Status: {event.event_status}</p>

      {/* Show edit button if the user is the organiser */}
      {event.event_organiser === userIdInt && (
        <button
          onClick={() => onEdit(event)}
          className="mt-4 px-6 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Edit
        </button>
      )}

      {/* View More Button */}
      <button
        onClick={() => onViewMore(event)}
        className="mt-4 ml-4 px-6 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        View More
      </button>

      {/* View Task Status Button */}
      {event.event_organiser === userIdInt && (
        <button
          onClick={handleViewTaskStatus}
          className="mt-4 ml-4 px-6 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          View Task Status
        </button>
      )}

      {/* Reusing Task Tracker Modal */}
      {isTaskTrackerOpen && (
        <TaskTrackerModal event={event} onClose={closeTaskTracker} />
      )}
    </div>
  );
};

const calculateDaysLeft = (eventDate: string) => {
  const eventDateObj = new Date(eventDate);
  const currentDate = new Date();
  const differenceInTime = eventDateObj.getTime() - currentDate.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
};

export default EventCard;
