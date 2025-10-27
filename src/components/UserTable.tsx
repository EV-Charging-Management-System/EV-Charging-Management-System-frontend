import React, { useState } from "react";
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
  onAdd: (user: Partial<User>) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserTable: React.FC<Props> = ({ users, onAdd, onEdit, onDelete }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    UserName: "",
    Mail: "",
    RoleName: "STAFF",
    CompanyId: 1,
  });

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    if (selectedUser) {
      onEdit(selectedUser);
      handleClose();
    }
  };

  const handleAdd = () => {
    if (newUser.UserName && newUser.Mail) {
      onAdd(newUser);
      setNewUser({ UserName: "", Mail: "", RoleName: "STAFF", CompanyId: 1 });
      handleClose();
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  return (
    <section className="data-section">
      <div className="data-section-header">
        <h2>👤 Danh sách tài khoản</h2>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + Thêm tài khoản
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Công ty</th>
            <th>Hành động</th>
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
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowDeleteModal(true);
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không có tài khoản nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* === MODAL: EDIT === */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>✏️ Chỉnh sửa tài khoản</h3>

            <label>Tên đăng nhập</label>
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

            <label>Vai trò</label>
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

            <label>Mã công ty</label>
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
                Lưu
              </button>
              <button className="btn-cancel" onClick={handleClose}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL: ADD === */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>➕ Thêm tài khoản mới</h3>

            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={newUser.UserName || ""}
              onChange={(e) => setNewUser({ ...newUser, UserName: e.target.value })}
            />

            <label>Email</label>
            <input
              type="email"
              value={newUser.Mail || ""}
              onChange={(e) => setNewUser({ ...newUser, Mail: e.target.value })}
            />

            <label>Vai trò</label>
            <select
              value={newUser.RoleName || "STAFF"}
              onChange={(e) => setNewUser({ ...newUser, RoleName: e.target.value })}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
              <option value="EVDRIVER">EVDRIVER</option>
              <option value="BUSINESS">BUSINESS</option>
            </select>

            <label>Mã công ty</label>
            <input
              type="number"
              value={newUser.CompanyId || 1}
              onChange={(e) =>
                setNewUser({ ...newUser, CompanyId: Number(e.target.value) })
              }
            />

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleAdd}>
                Thêm
              </button>
              <button className="btn-cancel" onClick={handleClose}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL: DELETE CONFIRM === */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>⚠️ Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa tài khoản{" "}
              <strong>{selectedUser.UserName}</strong> không?
            </p>

            <div className="modal-buttons">
              <button
                className="btn-delete"
                onClick={() => {
                  onDelete(selectedUser.UserId);
                  handleClose();
                }}
              >
                Xóa
              </button>
              <button className="btn-cancel" onClick={handleClose}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserTable;
