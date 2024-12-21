import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getItemFromLocalStorage } from "../../../shared/utilities/common/storage.ts";
import { StorageItems } from "../../../shared/constants/app.ts";
import { isLoggedIn } from "../../../shared/utilities/common/user.ts";
import Loader from "../widget/Loader.tsx";

function AuthLayout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = getItemFromLocalStorage(StorageItems.USER_INFO, "object");

  useEffect(() => {
    setLoading(true);
    if (isLoggedIn(user)) navigate("/");
    else setLoading(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
