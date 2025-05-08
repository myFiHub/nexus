import React from 'react';
import Card from '../common/Card';

/**
 * RecentTransactions props
 */
type Transaction = {
  id: number;
  type: string;
  outpost: string;
  amount: number;
  date: string;
};
type RecentTransactionsProps = {
  transactions: Transaction[];
};

/**
 * RecentTransactions: list of recent transactions
 */
const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-2">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <div className="text-neutral-400">No recent transactions.</div>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {transactions.map(tx => (
            <li key={tx.id} className="py-2 flex justify-between items-center text-sm">
              <span className="font-semibold">{tx.type}</span>
              <span>{tx.outpost}</span>
              <span>{tx.amount}Ξ</span>
              <span className="text-neutral-500">{tx.date}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentTransactions; 