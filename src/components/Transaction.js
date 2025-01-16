import React, { useEffect, useState } from 'react';
import { Button, Pagination, Alert } from 'react-bootstrap';
import axios from 'axios';
import AddEditTransactionModal from './modals/AddEditTransactionModal';
import DeleteTransactionModal from './modals/DeleteTransactionModal';
import './styles.css';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/transaction', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const sortedTransactions = response.data.sort((a, b) => new Date(b.fechaTransaccion) - new Date(a.fechaTransaccion));
        setTransactions(sortedTransactions);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos de las transacciones!', error);
      });
  }, []);

  const handleDelete = (id) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8080/transaction/${transactionToDelete}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        const updatedTransactions = transactions.filter(transaction => transaction.idTransaccion !== transactionToDelete);
        setTransactions(updatedTransactions);
        setShowDeleteModal(false);
      })
      .catch(error => {
        console.error('Hubo un error al eliminar la transacción!', error);
      });
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-start">
        <h2 className="mb-3">Detalles de las Transacciones</h2>
        <hr className="w-100" />
        <Button variant="primary" onClick={() => setShowAddEditModal(true)} className="mb-3">
          Agregar Transacción
        </Button>
      </div>
      {transactions.length === 0 ? (
        <div>No se ha encontrado ningún dato, agrega uno...</div>
      ) : (
        <>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">ID de Transacción</th>
                <th scope="col">Monto</th>
                <th scope="col">Giro del Comercio</th>
                <th scope="col">Nombre del Cliente</th>
                <th scope="col">Fecha de Transacción</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map(transaction => (
                <tr key={transaction.idTransaccion}>
                  <td>{transaction.idTransaccion}</td>
                  <td>${transaction.montoTransaccion}</td>
                  <td>{transaction.giroComercio}</td>
                  <td>{transaction.nombreTenpista}</td>
                  <td>{new Date(transaction.fechaTransaccion).toLocaleString()}</td>
                  <td>
                    <Button variant="warning" onClick={() => setShowAddEditModal(true)} className="btn-spacing">
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(transaction.idTransaccion)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination>
            {Array.from({ length: Math.ceil(transactions.length / transactionsPerPage) }, (_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}

      <AddEditTransactionModal show={showAddEditModal} onHide={() => setShowAddEditModal(false)} setTransactions={setTransactions} setErrorMessage={setErrorMessage} />
      <DeleteTransactionModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} confirmDelete={confirmDelete} />
    </div>
  );
};

export default Transaction;