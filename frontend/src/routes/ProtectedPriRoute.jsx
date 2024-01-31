import { Navigate } from "react-router-dom";

function ProtectedPriRoute({ children }) {
  const priUserData = JSON.parse(localStorage.getItem("pUserData"));

  console.log(priUserData);

  if (priUserData == null ||priUserData == undefined || priUserData == "" ) {
    // Use Navigate component within a returned JSX expression
    return <Navigate to={'/pUsers/login'} />;
  }

  return (
    <div>
      {/* Render the protected content */}
      {children}
    </div>
  );
}

export default ProtectedPriRoute;
