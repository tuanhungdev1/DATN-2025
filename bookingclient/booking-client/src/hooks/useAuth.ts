import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetCurrentUserQuery } from "@/services/endpoints/auth.api";
import { logout } from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { isError } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated || (isAuthenticated && !!user),
  });

  useEffect(() => {
    if (isError && isAuthenticated) {
      dispatch(logout());
    }
  }, [isError, dispatch, isAuthenticated]);

  return { user, isAuthenticated };
};
