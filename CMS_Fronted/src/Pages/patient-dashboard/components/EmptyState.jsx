import React from 'react';

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-icon-circle">{icon}</div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-subtitle">{subtitle}</p>
    </div>
  );
}
