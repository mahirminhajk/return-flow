import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { BreadcrumbData } from "@/config/breadcrumbConfig";

interface BreadcrumbProps {
  routes: BreadcrumbData[];
}

export const AppBreadcrumb: React.FC<BreadcrumbProps> = ({ routes }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {routes.map((route, index) => (
          <BreadcrumbItem key={index}>
            {route.path ? (
              <BreadcrumbLink to={route.path}>{route.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{route.label}</BreadcrumbPage>
            )}
            {index < routes.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
