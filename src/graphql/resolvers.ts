import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const filePath = path.resolve(process.cwd(), 'transactions.json');

const loadTransactionsFromFile = (): Transaction[] => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const saveTransactionsToFile = (transactions: Transaction[]) => {
  fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
};

const transactions: Transaction[] = loadTransactionsFromFile();

export const resolvers = {
  Query: {
    transactions: () => transactions,
  },
  Mutation: {
    addTransaction: (_parent: unknown, { description, amount, date }: { description: string; amount: number; date: string }) => {
      const transaction: Transaction = { id: uuidv4(), description, amount, date };
      transactions.push(transaction);
      saveTransactionsToFile(transactions);
      return transaction;
    },
    deleteTransaction: (_parent: unknown, { id }: { id: string }) => {
      const index = transactions.findIndex(transaction => transaction.id === id);
      if (index !== -1) {
        const [deletedTransaction] = transactions.splice(index, 1);
        saveTransactionsToFile(transactions);
        return deletedTransaction;
      }
      throw new Error('Transaction not found');
    },
    updateTransaction: (_parent: unknown, { id, description, amount, date }: { id: string; description: string; amount: number; date: string }) => {
      const index = transactions.findIndex(transaction => transaction.id === id);
      if (index !== -1) {
        transactions[index] = { id, description, amount, date };
        saveTransactionsToFile(transactions);
        return transactions[index];
      }
      throw new Error('Transaction not found');
    },
  },
};