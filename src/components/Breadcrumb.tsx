import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="breadcrumb">
      <button className="breadcrumb-item" onClick={() => {}}>
        <Home size={16} />
      </button>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <button
            className={`breadcrumb-item ${index === items.length - 1 ? "active" : ""}`}
            onClick={item.onClick}
            disabled={index === items.length - 1}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
