import React, { useEffect, useState } from "react";
import "../../css/Business.css";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import MenuBar from "../layouts/menu-bar";
import { authService } from "../../services/authService";
import { businessService } from "../../services/businessService";
import BusinessInvoices from "../../components/BusinessInvoices"; 
import VehicleManager from "../../components/VehicleManager";
import SessionHistory from "../../components/SessionHistory";
import BusinessOverview from "../../components/BusinessOverview";
import { toast } from "react-toastify";

const Business: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "vehicles" | "sessions" | "overview" | "lookup" | "invoices"
  >("vehicles");

  const [licenseLookup, setLicenseLookup] = useState("");
  const [lookupResult, setLookupResult] = useState<any>(null);

  // Load current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await authService.getProfile();
        const u = profile?.user || profile?.data || profile;
        setUser(u);
        console.log("👤 User profile:", u);
      } catch (err) {
        console.error("❌ Failed to load user info:", err);
        toast.error("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Load company information for BUSINESS user
  useEffect(() => {
    const fetchCompany = async () => {
      if (!user) return;

      const role = user.RoleName || user.role;
      if (role !== "BUSINESS") return;

      const id = user.CompanyId ?? user.companyId;

      if (!id) {
        console.warn("⚠️ User has no companyId!");
        return;
      }

      try {
        const res = await businessService.getCompanyOverview(id);
        if (res.success && res.data) {
          setCompany(res.data);
          console.log("🏢 Company data:", res.data);
        } else {
          toast.warn("Company information not found!");
        }
      } catch (err) {
        console.error("❌ Error loading company info:", err);
        toast.error("Error loading company information!");
      }
    };

    fetchCompany();
  }, [user]);

  // Lookup company by license plate
  const handleLookup = async () => {
    if (!licenseLookup.trim()) {
      toast.warn("⚠️ Please enter a license plate.");
      return;
    }
    try {
      const res = await businessService.lookupCompanyByPlate(licenseLookup.trim());
      if (res.success && res.data) {
        setLookupResult(res.data);
        toast.success("✅ Company found!");
      } else {
        setLookupResult(null);
        toast.error(res.message || "No company owns this vehicle.");
      }
    } catch (err) {
      console.error("❌ Lookup error:", err);
      toast.error("Unable to connect to server.");
    }
  };

  // Send business upgrade request
  const handleUpgrade = async () => {
    try {
      const res = await businessService.requestUpgrade(
        user?.userId || user?.UserId
      );
      if (res.success) {
        toast.success(
          "🎯 Business upgrade request sent. Please wait for admin approval."
        );
      } else {
        toast.error(res.message || "Unable to submit request.");
      }
    } catch (err) {
      console.error("❌ Upgrade request error:", err);
      toast.error("An error occurred. Please try again later.");
    }
  };

  if (loading) return <div className="loading-text">Loading...</div>;

  // ==============================
  // DISPLAY BUSINESS DASHBOARD
  // ==============================
  if ((user?.RoleName || user?.role) === "BUSINESS") {
    return (
      <div className="page-container">
        <Header />
        <MenuBar />

        <main className="page-body fade-in">
          <div className="business-dashboard">
            <h1 className="page-title">👔 Business Dashboard</h1>
            <p className="page-description">
              Welcome, <b>{user?.FullName || user?.UserName}</b>! Manage your business here.
            </p>

            {/* TAB MENU */}
            <div className="business-tabs">
              <button
                className={`tab-btn ${activeTab === "vehicles" ? "active" : ""}`}
                onClick={() => setActiveTab("vehicles")}
              >
                🚗 Vehicle Management
              </button>

              <button
                className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
                onClick={() => setActiveTab("sessions")}
              >
                ⚡ Charging History
              </button>

              <button
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                💰 Analytics
              </button>

              <button
                className={`tab-btn ${activeTab === "invoices" ? "active" : ""}`}
                onClick={() => setActiveTab("invoices")}
              >
                🧾 Invoices
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="tab-content">
              {activeTab === "vehicles" && (
                <VehicleManager companyId={company?.companyId || user?.CompanyId} />
              )}

              {activeTab === "sessions" && (
                <div className="business-section">
                  <SessionHistory companyId={company?.companyId || user?.CompanyId} />
                </div>
              )}

              {activeTab === "overview" && (
                <div className="business-section">
                  <BusinessOverview companyId={company?.companyId || user?.CompanyId} />
                </div>
              )}

              {activeTab === "invoices" && (
                <BusinessInvoices companyId={company?.companyId || user?.CompanyId} />
              )}

              {activeTab === "lookup" && (
                <div className="business-section">
                  {lookupResult && (
                    <div className="lookup-result">
                      <p><strong>Company:</strong> {lookupResult.CompanyName || "N/A"}</p>
                      <p><strong>Address:</strong> {lookupResult.Address || "N/A"}</p>
                      <p><strong>Email:</strong> {lookupResult.CompanyMail || "N/A"}</p>
                      <p><strong>Phone:</strong> {lookupResult.Phone || "N/A"}</p>
                      <p><strong>Vehicle:</strong> {lookupResult.VehicleName} ({lookupResult.LicensePlate})</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==============================
  // NOT A BUSINESS USER → SHOW UPGRADE PAGE
  // ==============================
  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body fade-in">
        <div className="business-card text-center">
          <h1 className="page-title">Business Partnership</h1>
          <p className="page-description">
            Expand your EV charging network with us — a green energy solution for the future.
          </p>

          <div className="business-content">
            <h3>🎯 Become an EV Business Partner</h3>
            <p>
              Manage charging stations, vehicles, staff, and receive periodic revenue reports.
            </p>

            <button className="btn-premium" onClick={handleUpgrade}>
              Submit Upgrade Request
            </button>

            <button className="btn-back" onClick={() => navigate("/premium")}>
              ← Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Business;
