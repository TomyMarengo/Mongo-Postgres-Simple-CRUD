import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";

export default function EntityTable({
  data,
  entityFields,
  handleEdit,
  handleDelete,
}) {
  return (
    <Table striped hover>
      <thead>
        <tr>
          {entityFields.map((field) => (
            <th key={field.name}>{field.label}</th>
          ))}
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {entityFields.map((field) => (
              <td key={field.name}>{item[field.name]}</td>
            ))}
            <td className="d-flex justify-content-around flex-wrap">
              <button
                onClick={() => handleEdit(item)}
                className="btn btn-warning"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="btn btn-danger"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

EntityTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  entityFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
