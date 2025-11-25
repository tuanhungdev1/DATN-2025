/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/common/AppBreadcrumbs.tsx
import React from "react";
import { Breadcrumbs, Link, Typography, Box, styled } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  fontSize: "14px",
  "& .MuiBreadcrumbs-separator": {
    margin: "0 4px",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: "14px",
  color: "#006ce4",
  textDecoration: "none",
  fontWeight: 400,
  cursor: "pointer",
  transition: "color 0.2s ease",
  display: "inline-flex",
  alignItems: "center",

  "&:hover": {
    color: "#004a9c",
    textDecoration: "underline",
  },

  "&:active": {
    color: "#003d82",
  },
}));

const StyledCurrentPage = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.text.primary,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
}));

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
}

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = ({
  items,
  maxItems,
  separator,
  showHomeIcon = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    path?: string
  ) => {
    event.preventDefault();
    if (path) {
      navigate(path);
    }
  };

  const defaultSeparator = (
    <ChevronRight
      size={14}
      strokeWidth={2}
      style={{
        color: "#6b7280",
        marginTop: 1,
      }}
    />
  );

  return (
    <Box sx={{ py: 1.5 }}>
      <StyledBreadcrumbs
        maxItems={maxItems}
        separator={separator || defaultSeparator}
        aria-label="breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast) {
            // Trang hiện tại - không có link
            return (
              <StyledCurrentPage key={index}>
                {item.icon && (
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      mr: 0.5,
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                )}
                {item.label}
              </StyledCurrentPage>
            );
          }

          // Các trang trước đó - có link
          return (
            <StyledLink
              key={index}
              href={item.path || "#"}
              onClick={(e) => handleClick(e, item.path)}
            >
              {item.icon && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    mr: 0.5,
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </Box>
              )}
              {item.label}
            </StyledLink>
          );
        })}
      </StyledBreadcrumbs>
    </Box>
  );
};

export default AppBreadcrumbs;
