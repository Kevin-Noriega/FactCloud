import React from "react";

const KPICard = ({ label, value }) => (
  <div className="col-md-3">
    <div className="card kpi p-3 shadow-sm">
      <h6 className="text-muted">{label}</h6>
      <h3 className="fw-bold">{value}</h3>
    </div>
  </div>
);

export default KPICard;
