import StaffTable from "../../../components/StaffTable";
import CreateStaff from "../../../components/CreateStaff";

const StaffSection = ({ staffList, loading, refresh }: any) => {
  return (
    <div className="staff-section">
      <CreateStaff onCreated={refresh} />
      <StaffTable staffList={staffList} loading={loading} />
    </div>
  );
};

export default StaffSection;
