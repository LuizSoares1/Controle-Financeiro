"use client";

import { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil1Icon, TrashIcon, DownloadIcon } from '@radix-ui/react-icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      description
      amount
      date
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
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

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const FormList = ({ refresh, onEditTransaction }: { refresh: boolean, onEditTransaction: (transaction: Transaction) => void }) => {
  const { data, refetch } = useQuery(GET_TRANSACTIONS, {
    fetchPolicy: 'network-only',
  });

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => {
      refetch();
    },
  });

  useEffect(() => {
    refetch();
  }, [refresh, refetch]);

  const transactions = data?.transactions || [];

  const formatarData = (data: string) => {
    const [dia, mes, ano] = data.split('/');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarValor = (valor: number) => {
    return valor.toFixed(2).replace('.', ',');
  };

  const handleDelete = (id: string) => {
    deleteTransaction({ variables: { id } });
  };

  const totalAmount = transactions.reduce((total: number, transaction: Transaction) => total + transaction.amount, 0);

  const downloadPDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Lista de Despesas';
    const titleX = pageWidth / 2 - (doc.getTextWidth(title) / 2);
    doc.text(title, titleX, 16);
    autoTable(doc, {
      startY: 20,
      head: [['Despesa', 'Data', 'Valor']],
      body: transactions.map((transaction: Transaction) => [
        transaction.description,
        formatarData(transaction.date),
        `R$ ${formatarValor(transaction.amount)}`,
      ]),
    });
    const finalY = doc.lastAutoTable.finalY || 10;
    autoTable(doc, {
      head: [['Total']],
      body: [[`R$ ${formatarValor(totalAmount)}`]],
      startY: finalY + 10,
    });
    doc.save('lista_de_despesas.pdf');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Despesas</CardTitle>
        <Button  onClick={downloadPDF} className="ml-auto">
          <DownloadIcon />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Despesa</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{formatarData(transaction.date)}</TableCell>
                <TableCell>R$ {formatarValor(transaction.amount)}</TableCell>
                <TableCell>
                  <Button
                    variant="default"
                    onClick={() => onEditTransaction(transaction)}
                    className="mx-2"
                  >
                    <Pencil1Icon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(transaction.id)}
                    className="mx-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="font-bold">Total:</TableCell>
              <TableCell colSpan={2} className="font-bold">R$ {formatarValor(totalAmount)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FormList;