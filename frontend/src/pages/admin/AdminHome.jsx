/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import PrimaryUsers from "./PrimaryUsers";
import Organizations from "./Organizations";
import SecUsersListAdmin from "./SecUsersListAdmin";
const AdminHome = () => {
  const [tab, setTab] = useState("pUsers");

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  console.log(tab);

  return (
    <div className="flex">
      <div className="overflow-y-hidden z-50" style={{ height: "100vh" }}>
        <AdminSidebar onTabChange={handleTabChange} />
      </div>

      <div className="flex-1 overflow-x-auto">
        {tab === "pUsers" && <PrimaryUsers className="overflow-y-auto" />}
        {tab === "secUsers" && <SecUsersListAdmin className="overflow-y-auto" />}
        {tab === "organizationList" && (
          <Organizations className="overflow-y-auto" />
        )}
      </div>
    </div>
  );
};

export default AdminHome;
