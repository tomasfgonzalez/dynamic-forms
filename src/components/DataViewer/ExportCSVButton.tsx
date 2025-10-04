import React from "react";

interface ExportCSVButtonProps {
  data: any[];                // array of rows
  fields: { name: string }[]; // schema fields
  filename?: string;          // optional filename
  buttonText?: string;        // optional button text
  className?: string;         // optional styling
}

const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  data,
  fields,
  filename,
  buttonText = "Export to CSV",
  className = "btn blue", // use the blue variant
}) => {
  const handleExport = () => {
    if (!fields || data.length === 0) return;

    const headers = fields.map((f) => f.name);
    const csvRows = [
      headers.join(","), // header row
      ...data.map((row) =>
        headers
          .map((field) => {
            const value = row[field] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename ?? `data_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className={className} onClick={handleExport}>
      {buttonText}
    </button>
  );
};

export default ExportCSVButton;
