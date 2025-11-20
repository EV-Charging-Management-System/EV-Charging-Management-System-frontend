interface Props {
  icon: JSX.Element;
  value: string | number;
  label: string;
  highlight?: boolean;
}

const StatsCard: React.FC<Props> = ({ icon, value, label, highlight }) => {
  return (
    <div className={`card ${highlight ? "highlight" : ""}`}>
      {icon}
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
};

export default StatsCard;
