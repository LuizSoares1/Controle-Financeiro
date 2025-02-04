"use client";

import { useState } from 'react';
import FormInput from './formInput';
import FormList from './formList';
import { Card } from '@/components/ui/card';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const TransactionManager = () => {
  const [refresh, setRefresh] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
  };

  const clearEdit = () => {
    setTransactionToEdit(null);
  };

  return (
    <div>
        <Card className='my-5 mx-3'>
            <FormInput onAddTransaction={handleRefresh} transactionToEdit={transactionToEdit} clearEdit={clearEdit} />
        </Card>
        <Card className='my-5 mx-3'>
            <FormList refresh={refresh} onEditTransaction={handleEdit} />
        </Card>
    </div>
  );
};

export default TransactionManager;