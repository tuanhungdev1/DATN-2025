import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { PageLoading } from "@/components/loading";
import routes from ".";

const AppRoutes = () => {
  const element = useRoutes(routes);

  return <Suspense fallback={<PageLoading />}>{element}</Suspense>;
};

export default AppRoutes;
