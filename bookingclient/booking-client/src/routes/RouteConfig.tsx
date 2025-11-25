/* eslint-disable @typescript-eslint/no-explicit-any */
import { type LazyExoticComponent } from "react";

export interface RouteMeta {
  requiresAuth?: boolean;
  restricted?: boolean;
  roles?: string[];
  layout?: "public" | "auth" | "main" | "dashboard" | "userProfile" | null; // thêm userProfile lại
  title?: string;
}

export interface RouteConfig {
  path?: string;
  index?: boolean;
  element?:
    | LazyExoticComponent<React.ComponentType<any>>
    | React.ElementType<any>;
  meta?: RouteMeta;
  children?: RouteConfig[];
}
