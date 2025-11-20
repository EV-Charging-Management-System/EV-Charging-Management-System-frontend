import StationTable from "../../../components/StationTable";

const StationSection = ({
  stations,
  onDelete,
  onViewPoints
}: any) => {
  return (
    <StationTable
      stations={stations}
      onAdd={() => {}}
      onEdit={() => {}}
      onDelete={onDelete}
      onViewPoints={onViewPoints}
    />
  );
};

export default StationSection;
