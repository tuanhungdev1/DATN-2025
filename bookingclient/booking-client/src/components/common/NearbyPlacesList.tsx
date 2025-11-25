import {
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Box,
  Alert,
  Skeleton,
} from "@mui/material";
import { ChevronDown, Navigation } from "lucide-react";
import { PLACE_CATEGORIES } from "@/constants/placeCategories";
import type { NearbyPlace } from "@/types/nearbyPlaces.types";
import { formatDistance, getWalkingTime } from "@/utils/formatDistance";
import React from "react";

interface NearbyPlacesListProps {
  nearbyPlaces: Record<string, NearbyPlace[]>;
  loading: boolean;
  error: string | null;
  expanded: string | false;
  onExpandChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

export const NearbyPlacesList = ({
  nearbyPlaces,
  loading,
  error,
  expanded,
  onExpandChange,
}: NearbyPlacesListProps) => {
  const allPlaces = Object.values(nearbyPlaces).flat();
  const hasPlaces = allPlaces.length > 0;

  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={80}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Stack>
    );
  }

  if (error) return <Alert severity="warning">{error}</Alert>;
  if (!hasPlaces)
    return (
      <Alert severity="info">
        Chưa có thông tin về các địa điểm xung quanh
      </Alert>
    );

  return (
    <Stack spacing={1}>
      {Object.entries(PLACE_CATEGORIES).map(([key, config]) => {
        const places = nearbyPlaces[key] || [];
        if (places.length === 0) return null;

        const Icon = config.icon;

        return (
          <Accordion
            key={key}
            expanded={expanded === key}
            onChange={onExpandChange(key)}
            sx={{
              "&:before": { display: "none" },
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
              "&.Mui-expanded": { margin: 0, mb: 1 },
            }}
          >
            <AccordionSummary expandIcon={<ChevronDown size={20} />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: `${config.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color={config.color} />
                </Box>
                <Typography fontWeight={600} sx={{ flex: 1 }}>
                  {config.label}
                </Typography>
                <Chip
                  label={places.length}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: `${config.color}20`,
                    color: config.color,
                    border: "none",
                  }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 0 }}>
              <List disablePadding>
                {places.map((place, index) => (
                  <React.Fragment key={place.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        py: 1.5,
                        px: 2,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: config.color,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography fontWeight={500} variant="body2">
                            {place.name}
                          </Typography>
                        }
                        secondary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mt: 0.5 }}
                          >
                            <Chip
                              label={formatDistance(place.distance)}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                bgcolor: "primary.lighter",
                                color: "primary.main",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <Navigation
                                size={11}
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: 2,
                                }}
                              />
                              {getWalkingTime(place.distance)} đi bộ
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
};
