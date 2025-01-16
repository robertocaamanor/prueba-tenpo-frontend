import React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

class AddEditTransactionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      montoTransaccion: '',
      giroComercio: '',
      nombreTenpista: '',
      errorMessage: ''
    };
  }

  componentDidMount() {
    const { isEditing, transactionId } = this.props;
    if (isEditing && transactionId) {
      this.fetchTransactionData(transactionId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.transactionId !== prevProps.transactionId && this.props.isEditing) {
      this.fetchTransactionData(this.props.transactionId);
    }
  }

  fetchTransactionData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/transaction/${id}`);
      const transaction = response.data;
      this.setState({
        montoTransaccion: transaction.montoTransaccion,
        giroComercio: transaction.giroComercio,
        nombreTenpista: transaction.nombreTenpista
      });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { isEditing, onSubmit, transactionId } = this.props;
    const { montoTransaccion, giroComercio, nombreTenpista } = this.state;
  
    const transactionData = { montoTransaccion, giroComercio, nombreTenpista };
  
    try {
      const response = await axios({
        method: isEditing ? 'PUT' : 'POST',
        url: `http://localhost:8080/transaction${isEditing ? `/${transactionId}` : ''}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: transactionData
      });
  
      const result = response.data;
      onSubmit(result);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 429) {
          this.setState({ errorMessage: error.response.data.message });
        } else {
          this.setState({ errorMessage: error.response.data.message || error.message });
        }
      } else if (error.request) {
        // The request was made but no response was received
        this.setState({ errorMessage: 'Has superado el número de transacciones permitidas en esta aplicación, inténtalo de nuevo dentro de 60 segundos' });
      } else {
        // Something happened in setting up the request that triggered an Error
        this.setState({ errorMessage: error.message });
      }
    }
  };

  handleClose = () => {
    this.setState({
      montoTransaccion: '',
      giroComercio: '',
      nombreTenpista: '',
      errorMessage: ''
    });
    this.props.handleClose();
  };

  render() {
    const { show, isEditing } = this.props;
    const { montoTransaccion, giroComercio, nombreTenpista, errorMessage } = this.state;

    return (
      <Modal show={show} onHide={this.handleClose}>
        <Modal.Header closeButton onHide={this.handleClose}>
          <Modal.Title>{isEditing ? 'Editar Transacción' : 'Agregar Nueva Transacción'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formMontoTransaccion">
              <Form.Label>Monto de la Transacción</Form.Label>
              <Form.Control
                type="number"
                name="montoTransaccion"
                value={montoTransaccion}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGiroComercio">
              <Form.Label>Giro del Comercio</Form.Label>
              <Form.Control
                type="text"
                name="giroComercio"
                value={giroComercio}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNombreTenpista">
              <Form.Label>Nombre del Cliente</Form.Label>
              <Form.Control
                type="text"
                name="nombreTenpista"
                value={nombreTenpista}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {isEditing ? 'Editar' : 'Agregar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

AddEditTransactionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  transactionId: PropTypes.string,
  transaction: PropTypes.object
};

export default AddEditTransactionModal;