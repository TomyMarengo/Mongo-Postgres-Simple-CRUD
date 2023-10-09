import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'

export default function EditEntityModal ({
  entityFields,
  entityName,
  showEditModal,
  editData,
  setEditData,
  handleSaveEdit,
  handleClose
}) {
  return (
    <Modal show={showEditModal} onHide={handleClose} className='text-black'>
      <Modal.Header closeButton>
        <Modal.Title>Edit {entityName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editData && (
          <form>
            {entityFields.map((field) => (
              <div className='mb-3' key={field.name}>
                <label htmlFor={field.name} className='form-label'>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className='form-control'
                  id={field.name}
                  value={editData[field.name]}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      [field.name]: e.target.value
                    })}
                />
              </div>
            ))}
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={() => handleSaveEdit(editData)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

EditEntityModal.propTypes = {
  entityFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired,
  entityName: PropTypes.string.isRequired,
  showEditModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
  setEditData: PropTypes.func.isRequired,
  handleSaveEdit: PropTypes.func.isRequired
}
