import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

function SortIcon({ column, sortKey, sortDir }) {
  if (column !== sortKey)
    return <ChevronsUpDown className="size-3.5 text-muted-foreground" />;
  return sortDir === "asc" ? (
    <ChevronUp className="size-3.5" />
  ) : (
    <ChevronDown className="size-3.5" />
  );
}

export default SortIcon;
