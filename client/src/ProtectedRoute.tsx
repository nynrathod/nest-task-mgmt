import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "./shared/utilities/common/user.ts";
import { getItemFromLocalStorage } from "./shared/utilities/common/storage.ts";
import { StorageItems } from "./shared/constants/app.ts";

const ProtectedRoute = ({ element, protectedRoute }: any) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getItemFromLocalStorage(StorageItems.USER_INFO, "object");

  useEffect(() => {
    const isUserLoggedIn = isLoggedIn(user);

    if (protectedRoute && !isUserLoggedIn) {
      navigate("/login");
      return;
    }

    if (!protectedRoute && isUserLoggedIn) {
      navigate("/");
      return;
    }

    setLoading(false);
  }, [navigate, user, location, protectedRoute]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
        <span>Loading...</span>
      </div>
    );
  }

  return <>{element}</>;
};

export default ProtectedRoute;
