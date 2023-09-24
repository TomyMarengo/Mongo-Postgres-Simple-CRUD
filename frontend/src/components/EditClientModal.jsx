import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

export default function EditClientModal({
  showEditModal,
  editClientData,
  setEditClientData,
  handleSaveEdit,
  handleClose,
}) {
  return (
    <Modal show={showEditModal} onHide={handleClose} className="text-black">
      <Modal.Header closeButton>
        <Modal.Title>Edit Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editClientData && (
          <form>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={editClientData.nombre}
                onChange={(e) =>
                  setEditClientData({
                    ...editClientData,
                    nombre: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">
                Apellido
              </label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                value={editClientData.apellido}
                onChange={(e) =>
                  setEditClientData({
                    ...editClientData,
                    apellido: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">
                Dirección
              </label>
              <input
                type="text"
                className="form-control"
                id="direccion"
                value={editClientData.direccion}
                onChange={(e) =>
                  setEditClientData({
                    ...editClientData,
                    direccion: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="activo" className="form-label">
                Activo
              </label>
              <input
                type="number"
                className="form-control"
                id="activo"
                value={editClientData.activo}
                onChange={(e) =>
                  setEditClientData({
                    ...editClientData,
                    activo: e.target.value,
                  })
                }
              />
            </div>
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveEdit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

EditClientModal.propTypes = {
  showEditModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  editClientData: PropTypes.object,
  setEditClientData: PropTypes.func.isRequired,
  handleSaveEdit: PropTypes.func.isRequired,
};
