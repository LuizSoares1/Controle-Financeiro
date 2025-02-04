"use client";

import { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ADD_TRANSACTION = gql`
  mutation AddTransaction($description: String!, $amount: Float!, $date: String!) {
    addTransaction(description: $description, amount: $amount, date: $date) {
      id
      description
      amount
      date
    }
  }
`;

const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $description: String!, $amount: Float!, $date: String!) {
    updateTransaction(id: $id, description: $description, amount: $amount, date: $date) {
      id
      description
      amount
      date
    }
  }
`;

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const FormInput = ({ onAddTransaction, transactionToEdit, clearEdit }: { onAddTransaction: () => void, transactionToEdit: Transaction | null, clearEdit: () => void }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [id, setId] = useState<string | null>(null);

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    onCompleted: () => {
      onAddTransaction();
      clearForm();
    },
  });

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    onCompleted: () => {
      onAddTransaction();
      clearForm();
    },
  });

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(`R$ ${transactionToEdit.amount.toFixed(2).replace('.', ',')}`);
      setDate(new Date(transactionToEdit.date.split('/').reverse().join('-')));
      setId(transactionToEdit.id);
    }
  }, [transactionToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedAmount = parseFloat(amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
      if (id) {
        await updateTransaction({ variables: { id, description, amount: formattedAmount, date: date ? format(date, 'dd/MM/yyyy') : '' } });
      } else {
        await addTransaction({ variables: { description, amount: formattedAmount, date: date ? format(date, 'dd/MM/yyyy') : '' } });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    value = (Number(value) / 100).toFixed(2) + '';
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setAmount('R$ ' + value);
  };

  const clearForm = () => {
    setDescription('');
    setAmount('');
    setDate(new Date());
    setId(null);
    clearEdit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? 'Editar Transação' : 'Adicionar Transação'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="transition-all duration-300 ease-in-out"
          />
          <Input
            type="text"
            placeholder="Valor"
            value={amount}
            onChange={handleAmountChange}
            className="transition-all duration-300 ease-in-out"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar Data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => setDate(selectedDate || date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button type="submit" className="w-full">
            {id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormInput;