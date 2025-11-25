import { useCallback, useState } from "react";
import { useToast } from "./useToast";
import { downloadFile } from "@/utils/downloadFile";

type ExportFormat = "excel" | "pdf" | "csv";

interface UseExportProps {
  fileName: string;
  defaultFileName?: string;
}

/**
 * Generic hook cho export dữ liệu
 */
export const useExport = ({
  fileName,
  defaultFileName = "export",
}: UseExportProps) => {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(
    async (exportFn: () => Promise<Blob>, format: ExportFormat) => {
      try {
        setIsExporting(true);
        const blob = await exportFn();

        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `${fileName}_${defaultFileName}_${timestamp}.${
          format === "excel" ? "xlsx" : format === "pdf" ? "pdf" : "csv"
        }`;

        downloadFile(blob, filename);
        toast.success(`${format.toUpperCase()} exported successfully`);
      } catch (error) {
        console.error("Export error:", error);
        toast.error(`Failed to export to ${format.toUpperCase()}`);
      } finally {
        setIsExporting(false);
      }
    },
    [defaultFileName, toast]
  );

  return {
    isExporting,
    handleExport,
  };
};
