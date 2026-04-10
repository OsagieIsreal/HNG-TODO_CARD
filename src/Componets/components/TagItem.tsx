import React from "react";

const TagItem: React.FC<{ tag: string }> = ({ tag }) => (
  <li
    style={{
      backgroundColor: "#f0edf5",
      color: "#6b5a7e",
      borderRadius: "6px",
      padding: "3px 10px",
      fontSize: "0.72rem",
      fontWeight: 600,
      letterSpacing: "0.03em",
      listStyle: "none",
      whiteSpace: "nowrap",
    }}
  >
    #{tag}
  </li>
);

export default TagItem;