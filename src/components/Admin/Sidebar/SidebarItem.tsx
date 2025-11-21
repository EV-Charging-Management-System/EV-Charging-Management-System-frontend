interface Props {
  active: boolean;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

const SidebarItem: React.FC<Props> = ({ active, label, icon, onClick }) => {
  return (
    <li
      className={active ? "active" : ""}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {icon}
      <span>{label}</span>
    </li>
  );
};

export default SidebarItem;
