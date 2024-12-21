import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getItemFromLocalStorage } from "../../../shared/utilities/common/storage.ts";
import { StorageItems } from "../../../shared/constants/app.ts";
import { isLoggedIn } from "../../../shared/utilities/common/user.ts";

function AuthLayout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = getItemFromLocalStorage(StorageItems.USER_INFO, "object");

  useEffect(() => {
    setLoading(true);
    if (isLoggedIn(user)) {
      console.log("yesloggedin");
      navigate("/home");
    } else {
      setLoading(false);
      console.log("nologin");
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
