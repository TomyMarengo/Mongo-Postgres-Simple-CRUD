import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Table } from 'react-bootstrap'

export default function EntityTable ({
  data,
  entityFields,
  handleEdit,
  handleDelete
}) {
  return (
    <Table striped hover>
      <thead>
        <tr>
          {entityFields.map((field) => (
            <th key={field.name}>{field.label}</th>
          ))}
          {handleEdit && handleDelete && <th className='text-center'>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr className='align-middle' key={index}>
            {entityFields.map((field) => (
              <td key={field.name}>{item[field.name]}</td>
            ))}
            {handleEdit && handleDelete && <td className='d-flex justify-content-center gap-3 flex-wrap'>
              <button
                onClick={() => handleEdit(item)}
                className='btn btn-warning'
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className='btn btn-danger'
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

EntityTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  entityFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func
}
