import React from "react";

interface SlotPickerProps {
  bookedSlots: number[];
  selectedSlot: number | null;
  onSelectSlot: (slotId: number) => void;
}

const ALL_SLOTS = [
  { id: 1, label: "00:00 - 03:00" },
  { id: 2, label: "03:00 - 06:00" },
  { id: 3, label: "06:00 - 09:00" },
  { id: 4, label: "09:00 - 12:00" },
  { id: 5, label: "12:00 - 15:00" },
  { id: 6, label: "15:00 - 18:00" },
  { id: 7, label: "18:00 - 21:00" },
  { id: 8, label: "21:00 - 24:00" }
];

export const SlotPicker: React.FC<SlotPickerProps> = ({
  bookedSlots,
  selectedSlot,
  onSelectSlot
}) => {
  return (
    <div className="slot-picker">
      <h3>Select Time Slot</h3>

      <div className="slot-grid">
        {ALL_SLOTS.map((slot) => {
          const isBooked = bookedSlots.includes(slot.id);

          return (
            <button
              key={slot.id}
              disabled={isBooked}
              className={`slot-btn ${
                isBooked
                  ? "slot-booked"
                  : selectedSlot === slot.id
                  ? "slot-selected"
                  : "slot-free"
              }`}
              onClick={() => !isBooked && onSelectSlot(slot.id)}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
