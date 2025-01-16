import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Pagination, Alert } from 'react-bootstrap';

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
    fetch('/transaction')
      .then(response => response.json())
      .then(data => {
        const sortedTransactions = data.sort((a, b) => new Date(b.fechaTransaccion) - new Date(a.fechaTransaccion));
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
      fetch(`http://spring-app:8080/transaction/${currentTransactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTransaction)
      })
        .then(response => response.json())
        .then(data => {
          const updatedTransactions = transactions.map(transaction =>
            transaction.idTransaccion === currentTransactionId ? data : transaction
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
      fetch('http://spring-app:8080/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTransaction)
      })
        .then(response => response.json())
        .then(data => {
          const sortedTransactions = [...transactions, data].sort((a, b) => new Date(b.fechaTransaccion) - new Date(a.fechaTransaccion));
          setTransactions(sortedTransactions);
          handleClose();
        })
        .catch(error => {
          console.error('Hubo un error al agregar la transacción!', error);
        });
    }
  };

  const handleEdit = (id) => {
    fetch(`http://spring-app:8080/transaction/${id}`)
      .then(response => response.json())
      .then(data => {
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
    fetch(`http://spring-app:8080/transaction/${transactionToDelete}`, {
      method: 'DELETE'
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

  if (transactions.length === 0) {
    return <div>Cargando...</div>;
  }

  // Obtener las transacciones actuales
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Cambiar de página
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h2>Detalles de las Transacciones</h2>
      <Button variant="primary" onClick={handleShow}>
        Agregar Transacción
      </Button>
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
                <Button variant="warning" onClick={() => handleEdit(transaction.idTransaccion)} className="mr-2">Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(transaction.idTransaccion)}>Eliminar</Button>
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