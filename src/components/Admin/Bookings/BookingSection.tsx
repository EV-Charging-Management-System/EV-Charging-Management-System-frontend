import BookingTable from "../../../components/BookingTable";

interface Props {
  bookings: any[];
  onCancel?: (id: number) => void;
}

const BookingSection: React.FC<Props> = ({ bookings, onCancel }) => {
  return (
    <BookingTable
      bookings={bookings}
      onCancel={onCancel || (() => {})}
    />
  );
};

export default BookingSection;
