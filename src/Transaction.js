import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Pagination, Alert } from 'react-bootstrap';
import axios from 'axios';
import './styles.css';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    montoTransaccion: '',
    giroComercio: '',
    nombreTenpista: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

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

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setNewTransaction({
      montoTransaccion: '',
      giroComercio: '',
      nombreTenpista: ''
    });
    setErrorMessage('');
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://localhost:8080/transaction/${currentTransactionId}`, newTransaction, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          const updatedTransactions = transactions.map(transaction =>
            transaction.idTransaccion === currentTransactionId ? response.data : transaction
          );
          setTransactions(updatedTransactions);
          handleClose();
        })
        .catch(error => {
          if (error.response && error.response.status === 429) {
            setErrorMessage('Ha realizado suficientes modificaciones en esta transacción, intente dentro de 60 segundos');
          } else {
            console.error('Hubo un error al editar la transacción!', error);
          }
        });
    } else {
      axios.post('http://localhost:8080/transaction', newTransaction, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          setTransactions([...transactions, response.data]);
          handleClose();
        })
        .catch(error => {
          console.error('Hubo un error al crear la transacción!', error);
        });
    }
  };

  const handleEdit = (id) => {
    axios.get(`http://localhost:8080/transaction/${id}`)
      .then(response => {
        const data = response.data;
        setNewTransaction({
          montoTransaccion: data.montoTransaccion,
          giroComercio: data.giroComercio,
          nombreTenpista: data.nombreTenpista
        });
        setCurrentTransactionId(id);
        setIsEditing(true);
        handleShow();
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos de la transacción!', error);
      });
  };

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

  // Obtener las transacciones actuales
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Cambiar de página
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-start">
        <h2 className="mb-3">Detalles de las Transacciones</h2>
        <hr className="w-100" />
        <Button variant="primary" onClick={handleShow} className="mb-3">
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
                  <Button variant="warning" onClick={() => handleEdit(transaction.idTransaccion)} className="btn-spacing">
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Transacción' : 'Agregar Nueva Transacción'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formMontoTransaccion">
              <Form.Label>Monto de la Transacción</Form.Label>
              <Form.Control
                type="number"
                name="montoTransaccion"
                value={newTransaction.montoTransaccion}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGiroComercio">
              <Form.Label>Giro del Comercio</Form.Label>
              <Form.Control
                type="text"
                name="giroComercio"
                value={newTransaction.giroComercio}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNombreTenpista">
              <Form.Label>Nombre del Cliente</Form.Label>
              <Form.Control
                type="text"
                name="nombreTenpista"
                value={newTransaction.nombreTenpista}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {isEditing ? 'Editar' : 'Agregar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar esta transacción?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transaction;