import React from 'react';
import "./RecordList.css";

type RecordId = string;

export interface ListItem<T> {
  record: T;
  id: RecordId;
  label: string;
}

interface RecordListProps<T> {
  title: string;
  items: ListItem<T>[];
  addButtonLabel: string;
  onAdd: () => void; // Assuming no parameters are passed to onAdd function
  configButtonLabel: string;
  onConfigure: (index: number) => void; // Assuming onConfigure needs item's id
}

function RecordList<T>({ title, items, addButtonLabel, onAdd, configButtonLabel, onConfigure }: RecordListProps<T>){
  return (
    <div className="common-list">
      <div className="list-header">
        <h2>{title}</h2>
        <button className="add-button" onClick={onAdd}>{addButtonLabel}</button>
      </div>
      {items.length === 0 && `No ${title.toLowerCase()} found`}
      <ul>
        {items.map((item, index) => (
          <li key={index} className="list-item">
            {item.label}
            <button className="configure-button" onClick={() => onConfigure(index)}>{configButtonLabel}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList;
