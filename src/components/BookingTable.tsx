import React, { useState, useEffect } from "react";
import "../css/AdminDashboard.css";

interface Booking {
  BookingId: number;
  UserName: string;
  StationName: string;
  StartTime: string;
  EndTime: string;
  Status: string;
}

interface BookingTableProps {
  bookings?: Booking[];
  onCancel?: (id: number) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ 
  bookings: propBookings, 
  onCancel 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (propBookings) {
      setBookings(propBookings);
      return;
    }

    const mockBookings: Booking[] = [
      {
        BookingId: 101,
        UserName: "driver01",
        StationName: "Central Charging Station",
        StartTime: "2025-10-27T08:00:00",
        EndTime: "2025-10-27T10:00:00",
        Status: "COMPLETED",
      },
      {
        BookingId: 102,
        UserName: "business01",
        StationName: "Binh Duong Charging Station",
        StartTime: "2025-10-28T13:00:00",
        EndTime: "2025-10-28T14:30:00",
        Status: "SCHEDULED",
      },
      {
        BookingId: 103,
        UserName: "staff01",
        StationName: "Hanoi Charging Station",
        StartTime: "2025-10-25T15:00:00",
        EndTime: "2025-10-25T16:30:00",
        Status: "CANCELLED",
      },
    ];
    setBookings(mockBookings);
  }, [propBookings]);

  return (
    <section className="data-section">
      <div className="data-section-header">
        <h2>📅 Booking List</h2>
        <button className="btn-add">+ Add Booking</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Charging Station</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.BookingId}>
              <td>{b.BookingId}</td>
              <td>{b.UserName}</td>
              <td>{b.StationName}</td>
              <td>{new Date(b.StartTime).toLocaleString()}</td>
              <td>{new Date(b.EndTime).toLocaleString()}</td>
              <td>
                <span
                  className={`status-badge ${
                    b.Status === "COMPLETED"
                      ? "active"
                      : b.Status === "SCHEDULED"
                      ? "warn"
                      : "inactive"
                  }`}
                >
                  {b.Status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default BookingTable;
