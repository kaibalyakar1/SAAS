import { useState } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import ComplaintsComponent from "../components/Admin/AdminComplaintsDashboard";
import ExpensesComponent from "../components/Admin/AdminExpenses";
import Properties from "../components/Admin/AdminProperties";
import AdminDashboard from "../components/Admin/AdminHomeDashboard";
import UnderConstruction from "./UnderConstruction";

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

      case "complaints":
        return <ComplaintsComponent />;

      case "payments":
        return <UnderConstruction />;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <div className="w-[100vw] flex">
      <AdminSidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <div className="flex-1 p-4">{renderComponent()}</div>
    </div>
  );
};

export default MainComponent;
