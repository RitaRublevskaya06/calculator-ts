import React from 'react';

interface HistoryProps {
  history: string[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div>
      <h3>История вычислений:</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default History;
