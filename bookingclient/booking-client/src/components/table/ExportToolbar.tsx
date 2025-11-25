import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

interface ExportToolbarProps {
  isExporting: boolean;
  onExcelClick: () => void;
  onPdfClick: () => void;
  onCsvClick: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  isExporting,
  onExcelClick,
  onPdfClick,
  onCsvClick,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={
          isExporting ? <CircularProgress size={20} /> : <FileDownloadIcon />
        }
        onClick={onExcelClick}
        disabled={isExporting}
        title="Export to Excel"
      >
        Excel
      </Button>

      <Button
        variant="outlined"
        size="small"
        startIcon={
          isExporting ? <CircularProgress size={20} /> : <FileDownloadIcon />
        }
        onClick={onPdfClick}
        disabled={isExporting}
        title="Export to PDF"
      >
        PDF
      </Button>

      <Button
        variant="outlined"
        size="small"
        startIcon={
          isExporting ? <CircularProgress size={20} /> : <FileDownloadIcon />
        }
        onClick={onCsvClick}
        disabled={isExporting}
        title="Export to CSV"
      >
        CSV
      </Button>
    </Box>
  );
};
