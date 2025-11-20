import UserTable from "../../../components/UserTable";

const UsersSection = ({ users, onAdd, onEdit, onDelete }: any) => {
  return (
    <UserTable
      users={users}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default UsersSection;
