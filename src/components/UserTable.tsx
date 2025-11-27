import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AdminDashboard.css";

interface User {
  UserId: number;
  UserName: string;
  Mail: string;
  RoleName: string;
  CompanyId?: number;
}

interface Props {
  users: User[];
  onAdd: (user: Partial<User>) => Promise<any>;
  onEdit: (user: User) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
}

const UserTable: React.FC<Props> = ({ users, onAdd, onEdit, onDelete }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔹 Khi nhấn Sửa
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // 🔹 Đóng tất cả modal
  const handleClose = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // ✅ Cập nhật người dùng (để AdminDashboard xử lý toast)
  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      await onEdit(selectedUser);
    } catch (err) {
      console.error("❌ Lỗi FE khi cập nhật:", err);
    } finally {
      handleClose();
    }
  };

  return (
    <section className="data-section">
      <div className="data-section-header">
        <h2>👤 Danh sách tài khoản</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.UserId}>
                <td>{u.UserId}</td>
                <td>{u.UserName}</td>
                <td>{u.Mail}</td>
                <td>{u.RoleName}</td>
                <td>{u.CompanyId || "—"}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditClick(u)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No accounts found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* === MODAL: EDIT === */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>✏️ Edit Account</h3>

            <label>Username</label>
            <input
              type="text"
              value={selectedUser.UserName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, UserName: e.target.value })
              }
            />

            <label>Email</label>
            <input
              type="email"
              value={selectedUser.Mail}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, Mail: e.target.value })
              }
            />

            <label>Role</label>
            <select
              value={selectedUser.RoleName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, RoleName: e.target.value })
              }
            >
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
              <option value="EVDRIVER">EVDRIVER</option>
              <option value="BUSINESS">BUSINESS</option>
            </select>

            <label>Company ID</label>
            <input
              type="number"
              value={selectedUser.CompanyId || 0}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  CompanyId: Number(e.target.value),
                })
              }
            />

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
              <button className="btn-cancel" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL: DELETE CONFIRM === */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>⚠️ Confirm Deletion</h3>
            <p>
              Are you sure you want to delete account{" "}
              <strong>{selectedUser.UserName}</strong>?
            </p>

            <div className="modal-buttons">
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserTable;
