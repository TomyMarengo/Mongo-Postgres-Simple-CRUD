import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";

export default function ClientTable({
  clients,
  handleEditClient,
  handleDeleteClient,
}) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Address</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.nro_cliente.toString()}>
            <td>{client.nro_cliente.toString()}</td>
            <td>{client.nombre}</td>
            <td>{client.apellido}</td>
            <td>{client.direccion}</td>
            <td>{client.activo}</td>
            <td className="d-flex justify-content-around flex-wrap">
              <button
                onClick={() => handleEditClient(client)}
                className="btn btn-warning"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => handleDeleteClient(client.nro_cliente)}
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

ClientTable.propTypes = {
  clients: PropTypes.array.isRequired,
  handleEditClient: PropTypes.func.isRequired,
  handleDeleteClient: PropTypes.func.isRequired,
};
