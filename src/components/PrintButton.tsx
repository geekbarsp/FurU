"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button className="btn btn-primary checklist-print-button" onClick={() => window.print()}>
      <Printer /> Print or save as PDF
    </button>
  );
}
