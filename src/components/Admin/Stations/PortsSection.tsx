import PortTable from "../../../components/PortTable";

const PortsSection = ({
  ports,
  pointId,
  stationName,
  onAdd,
  onEdit,
  onDelete,
  onBack
}: any) => {
  return (
    <PortTable
      ports={ports}
      pointId={pointId}
      stationName={stationName}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onBack={onBack}
    />
  );
};

export default PortsSection;
