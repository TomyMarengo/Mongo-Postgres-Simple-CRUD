import EditClientModal from "../components/EditClientModal";
import ClientTable from "../components/ClientTable";

import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    activo: 0,
  });
  const [showEditModal, setShowEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición
  const [editClientData, setEditClientData] = useState(null); // Estado para almacenar los datos del cliente en edición
  const [fetchDataTrigger, setFetchDataTrigger] = useState(true);

  const handleCreateClient = () => {
    // Realiza una solicitud POST a tu API para crear un nuevo cliente
    fetch("http://localhost:3000/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClient),
    })
      .then((response) => response.json())
      .then((data) => {
        // Agrega el nuevo cliente a la lista existente de clientes
        setClients([...clients, data]);
        // Limpia el formulario
        setNewClient({ nombre: "", apellido: "", direccion: "", activo: 0 });
      })
      .catch((error) => {
        console.error("Error al crear un nuevo cliente:", error);
      });

    setFetchDataTrigger(true);
  };

  const handleEditClient = (client) => {
    // All client without nro_cliente
    setEditClientData(client); // Establece los datos del cliente en edición
    setShowEditModal(true); // Muestra el modal de edición
  };

  const handleSaveEdit = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { nro_cliente, ...clientData } = editClientData;
      // Realiza una solicitud PUT a tu API con los datos editados
      const response = await fetch(
        `http://localhost:3000/clientes/${editClientData.nro_cliente}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(clientData), // Envía los datos editados del cliente
        }
      );

      if (response.ok) {
        setShowEditModal(false);
        setFetchDataTrigger(true);
      } else {
        // Si hay un error, muestra un mensaje de error
        toast.error("Error al editar el cliente", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error al editar el cliente:", error);
      toast.error("Error al editar el cliente", { position: "top-center" });
    }
  };

  const handleDeleteClient = (clientId) => {
    // Realiza una solicitud DELETE a tu API para eliminar el cliente
    fetch(`http://localhost:3000/clientes/${clientId}`, {
      method: "DELETE",
    })
      .then(async (response) => {
        if (response.ok) {
          setFetchDataTrigger(true);
        } else {
          // Si hay un error, intenta obtener el texto del cuerpo de la respuesta
          try {
            const errorText = await response.text();
            // Muestra el mensaje de error en un toast
            toast.error(errorText, { position: "top-center" });
          } catch (error) {
            // Si no se pudo obtener el texto de la respuesta, muestra un mensaje de error genérico
            toast.error("Error al eliminar el cliente", {
              position: "top-center",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el cliente:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/clientes");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    };

    if (fetchDataTrigger) {
      fetchData(); // Llama a la función para obtener datos cuando se active el disparador
      setFetchDataTrigger(false); // Restablece el disparador
    }
  }, [fetchDataTrigger, clients]);

  return (
    <Container>
      <h1 className="my-5">Clients</h1>

      <h2 className="mt-5">Create New Client</h2>
      <div className="d-flex gap-2">
        <input
          type="text"
          placeholder="First name"
          value={newClient.nombre}
          onChange={(e) =>
            setNewClient({ ...newClient, nombre: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newClient.apellido}
          onChange={(e) =>
            setNewClient({ ...newClient, apellido: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          value={newClient.direccion}
          onChange={(e) =>
            setNewClient({ ...newClient, direccion: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Last Name"
          value={newClient.activo}
          onChange={(e) =>
            setNewClient({ ...newClient, activo: e.target.value })
          }
        />
        <button onClick={handleCreateClient}>Create Client</button>
      </div>

      {/* Table */}
      <h2 className="my-5">List of Clients</h2>

      <ClientTable
        clients={clients}
        handleEditClient={handleEditClient}
        handleDeleteClient={handleDeleteClient}
      />

      <EditClientModal
        showEditModal={showEditModal}
        editClientData={editClientData}
        setEditClientData={setEditClientData}
        handleSaveEdit={handleSaveEdit}
        handleClose={() => setShowEditModal(false)}
      />

      <ToastContainer />
    </Container>
  );
}
