import { FaPhoneAlt } from "react-icons/fa";
import Notification from "../../components/Notification";
import ProfileUser from "../../components/ProfileUser";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { registerSchema } from "../../utils/validationSchemas";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // ==== Register modal state ====
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    Email: "",
    PasswordHash: "",
    ConfirmPassword: "",
    FullName: "",
  });
  const [registerErrors, setRegisterErrors] = useState<any>({});
  const [registerLoading, setRegisterLoading] = useState(false);

  const openRegister = () => setShowRegister(true);
  const closeRegister = () => {
    setShowRegister(false);
    setRegisterErrors({});
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (registerErrors[name]) {
      setRegisterErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrors({});

    // Validate using Yup schema
    try {
      await registerSchema.validate(registerForm, { abortEarly: false });
    } catch (err: any) {
      const validationErrors: any = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setRegisterErrors(validationErrors);
      return;
    }

    try {
      setRegisterLoading(true);
      const payload = {
        Email: registerForm.Email,
        PasswordHash: registerForm.PasswordHash,
        ConfirmPassword: registerForm.ConfirmPassword,
        FullName: registerForm.FullName,
        role: "EVDRIVER",
      };

      const res = await authService.register(payload as any);
      const success = !!res?.success;
      alert(success ? "✅ Đăng ký thành công!" : "❌ Đăng ký thất bại!");
      if (success) {
        closeRegister();
        navigate("/login");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogin = () => navigate("/login");

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert("Đăng xuất thất bại!");
    }
  };

  // ===============================
  return (
    <>
      {/* ✅ Navbar Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm">
        <Container fluid>
          <Navbar.Brand
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", fontWeight: 600 }}
          >
            ⚡ EV Charging System
          </Navbar.Brand>

          <Nav className="mx-auto text-light">
            <Nav.Item className="me-4 text-secondary fw-light">
              Optimising your journey, Powering your life
            </Nav.Item>
            <Nav.Item className="d-flex align-items-center">
              <FaPhoneAlt className="me-2 text-info" />
              <span className="text-warning fw-semibold">
                Hotline: 0112334567
              </span>
            </Nav.Item>
          </Nav>

          <Nav className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <>
                <Notification />
                <ProfileUser />
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={openRegister}
                >
                  Register
                </Button>
                <Button variant="primary" size="sm" onClick={handleLogin}>
                  Login
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* ✅ Register Modal */}
      <Modal
        show={showRegister}
        onHide={closeRegister}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Đăng ký tài khoản</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-dark text-light">
          <p className="text-secondary mb-4">For EV drivers (user)</p>

          <Form onSubmit={submitRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="Email"
                value={registerForm.Email}
                onChange={handleRegisterChange}
                placeholder="Nhập địa chỉ email"
              />
              {registerErrors.Email && (
                <div className="text-danger small mt-1">{registerErrors.Email}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                name="FullName"
                value={registerForm.FullName}
                onChange={handleRegisterChange}
                placeholder="Nhập họ và tên"
              />
              {registerErrors.FullName && (
                <div className="text-danger small mt-1">{registerErrors.FullName}</div>
              )}
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="PasswordHash"
                    value={registerForm.PasswordHash}
                    onChange={handleRegisterChange}
                    placeholder="Tạo mật khẩu"
                  />
                  {registerErrors.PasswordHash && (
                    <div className="text-danger small mt-1">{registerErrors.PasswordHash}</div>
                  )}
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Xác nhận</Form.Label>
                  <Form.Control
                    type="password"
                    name="ConfirmPassword"
                    value={registerForm.ConfirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {registerErrors.ConfirmPassword && (
                    <div className="text-danger small mt-1">{registerErrors.ConfirmPassword}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={closeRegister}>
                Hủy
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Đang đăng ký...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
