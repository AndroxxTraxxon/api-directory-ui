import React from 'react';
import "./RecordList.css";

type RecordId = string;

interface Record {
  record: object;
  id: RecordId;
  label: string;
}

interface RecordListProps {
  title: string;
  items: Record[];
  addButtonLabel: string;
  onAdd: () => void; // Assuming no parameters are passed to onAdd function
  configButtonLabel: string;
  onConfigure: (id: RecordId) => void; // Assuming onConfigure needs item's id
}

const RecordList = ({ title, items, addButtonLabel, onAdd, configButtonLabel, onConfigure }: RecordListProps) => {
  return (
    <div className="common-list">
      <div className="list-header">
        <h2>{title}</h2>
        <button className="add-button" onClick={onAdd}>{addButtonLabel}</button>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="list-item">
            {item.label}
            <button className="configure-button" onClick={() => onConfigure(item.id)}>{configButtonLabel}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList;
