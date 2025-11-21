import PointTable from "../../../components/PointTable";

const PointsSection = ({
  points,
  stationId,
  stationName,
  onAdd,
  onEdit,
  onDelete,
  onViewPorts,
  onBack
}: any) => {
  return (
    <PointTable
      points={points}
      stationId={stationId}
      stationName={stationName}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewPorts={onViewPorts}
      onBack={onBack}
    />
  );
};

export default PointsSection;
