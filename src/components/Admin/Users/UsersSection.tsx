import UserTable from "../../../components/UserTable";

const UsersSection = ({ users, onAdd, onEdit }: any) => {
  return (
    <UserTable
      users={users}
      onAdd={onAdd}
      onEdit={onEdit}
    />
  );
};

export default UsersSection;
