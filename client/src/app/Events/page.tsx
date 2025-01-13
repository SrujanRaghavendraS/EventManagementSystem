"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/(Components)/Navbar";
import Sidebar from "@/app/(Components)/Sidebar";
import EventModal from "@/app/(Components)/EventModal";
import AddEventModal from "@/app/(Components)/addEventModal"; // Import the new AddEventModal
import EditEventModal from "@/app/(Components)/EditEventModal"; // Import the EditEventModal component
import LoadingSpinner from "@/app/(Components)/LoadingSpinner";
import EventCard from "@/app/(Components)/EventCard"; // Ensure EventCard is correctly imported

const EventsPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const userIdInt = userId ? parseInt(userId, 10) : null;

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
  const [userDesignation, setUserDesignation] = useState<string | null>(null); // New state for user designation
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false); // State for AddEventModal
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    if (userIdInt) {
      fetch(`http://localhost:8000/events/user_events/${userIdInt}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch event data");
          return response.json();
        })
        .then((data) => {
          setEvents(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load events.");
          setLoading(false);
        });

      // Fetch user designation
      fetch(`http://localhost:8000/accounts/profile/${userIdInt}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch user data");
          return response.json();
        })
        .then((userData) => {
          setUserNames((prevState) => ({
            ...prevState,
            [userIdInt]: userData.user_name,
          }));
          setUserDesignation(userData.user_designation); // Assuming user_designation is in the response
        })
        .catch(() => {
          setError("Failed to load user data.");
          setLoading(false);
        });
    } else {
      setError("User ID not provided.");
      setLoading(false);
    }
  }, [userIdInt]);

  useEffect(() => {
    const fetchUserName = async (userId: number) => {
      if (!userNames[userId]) {
        try {
          const response = await fetch(
            `http://localhost:8000/accounts/profile/${userId}`
          );
          if (!response.ok) throw new Error("Failed to fetch user data");
          const userData = await response.json();
          setUserNames((prevState) => ({
            ...prevState,
            [userId]: userData.user_name,
          }));
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
    };

    events.forEach((event) => {
      if (event.event_organiser && !userNames[event.event_organiser]) {
        fetchUserName(event.event_organiser);
      }
    });
  }, [events, userNames]);

  const handleViewMore = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };

  const handleSaveEditedEvent = (updatedEvent: any) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleAddEvent = (newEvent: any) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]); // Add the new event to the list
  };

  const openAddEventModal = () => {
    setAddModalOpen(true); // Open the Add Event Modal
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      <Sidebar username="" email="" userId={userIdInt || 0} />
      <div className="ml-20 sm:ml-20 lg:ml-64 w-full p-8">
        <Navbar />
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-5xl mx-auto mt-8">
          <h2 className="text-4xl font-semibold text-center mb-8 text-green-500">
            Your Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any) => (
              <EventCard
                key={event.id || `${event.event_date}-${event.event_time}`} // Ensure unique key, fallback if id is undefined
                event={event}
                userNames={userNames}
                onViewMore={handleViewMore}
                onEdit={handleEdit}
                userIdInt={userIdInt}
              />
            ))}
          </div>

          {/* Conditionally render Add Event button based on user designation */}
          {userDesignation === "Manager" && (
            <div className="flex justify-center mt-8">
              <button
                onClick={openAddEventModal}
                className="bg-gray-600 text-white py-2 px-6 rounded-full text-xl hover:bg-gray-500 transition"
              >
                Add Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AddEventModal */}
      {addModalOpen && (
        <AddEventModal
          onClose={() => setAddModalOpen(false)}
          onAddEvent={handleAddEvent}
          userId={userIdInt} // Pass userIdInt to AddEventModal
        />
      )}

      {modalOpen && selectedEvent && (
        <EventModal
          event={selectedEvent}
          userNames={userNames}
          onClose={() => setModalOpen(false)}
        />
      )}

      {editModalOpen && selectedEvent && (
        <EditEventModal
          eventId={selectedEvent?.event_id} // Pass only eventId
          userNames={userNames}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEditedEvent}
        />
      )}
    </div>
  );
};

export default EventsPage;
