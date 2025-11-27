import StationTable from "../../../components/StationTable";

const StationSection = ({ stations, onDelete, onViewPoints, onCreate }: any) => {
  return (
    <StationTable
      stations={stations}
      onAdd={onCreate}
      onEdit={() => {}}
      onDelete={onDelete}
      onViewPoints={onViewPoints}
    />
  );
};

export default StationSection;
