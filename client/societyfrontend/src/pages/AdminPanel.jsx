import { useState } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import ComplaintsComponent from "../components/Admin/AdminComplaintsDashboard";
import ExpensesComponent from "../components/Admin/AdminExpenses";
import Properties from "../components/Admin/AdminProperties";
import AdminDashboard from "../components/Admin/AdminHomeDashboard";
import UnderConstruction from "./UnderConstruction";
import AdminPayments from "../components/Admin/AdminPayments";
import AdminIncome from "../components/Admin/AdminIncome";

const MainComponent = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <AdminDashboard />;
      case "properties":
        return <Properties />;
      case "expenses":
        return <ExpensesComponent />;
      case "income":
        return <AdminIncome />;
      case "complaints":
        return <ComplaintsComponent />;
      case "payments":
        return <AdminPayments />;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  // Using the AdminSidebar as a layout wrapper
  return (
    <AdminSidebar
      activeComponent={activeComponent}
      setActiveComponent={setActiveComponent}
    >
      <div className="flex-2 lg:ml-16 overflow-y-auto">{renderComponent()}</div>
    </AdminSidebar>
  );
};

export default MainComponent;
