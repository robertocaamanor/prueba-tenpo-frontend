import React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

class AddEditTransactionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      montoTransaccion: props.transaction ? props.transaction.montoTransaccion : '',
      giroComercio: props.transaction ? props.transaction.giroComercio : '',
      nombreTenpista: props.transaction ? props.transaction.nombreTenpista : '',
      errorMessage: ''
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { isEditing, onSubmit } = this.props;
    const { montoTransaccion, giroComercio, nombreTenpista } = this.state;

    if (isEditing) {
      onSubmit({ montoTransaccion, giroComercio, nombreTenpista });
    } else {
      onSubmit({ montoTransaccion, giroComercio, nombreTenpista });
    }
  };

  render() {
    const { show, handleClose, isEditing } = this.props;
    const { montoTransaccion, giroComercio, nombreTenpista, errorMessage } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
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
  transaction: PropTypes.object
};

export default AddEditTransactionModal;