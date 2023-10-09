import PropTypes from 'prop-types'

import EditEntityModal from '../components/EditEntityModal'
import EntityTable from '../components/EntityTable'
import CreateEntityForm from '../components/CreateEntityForm'

import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { separateFirstKeyValue, lowerFirstLetter } from '../utils/utils'

export default function EntityPage ({ entityFields, entityName, endpoint }) {
  const [data, setData] = useState([])
  const [showEditModal, setShowEditModal] = useState(false) // Estado para controlar la visibilidad del modal de edición
  const [editData, setEditData] = useState(null) // Estado para almacenar los datos del cliente en edición

  const entityNameLower = lowerFirstLetter(entityName)

  const handleCreate = (newData) => {
    // Realiza una solicitud POST a tu API para crear un nuevo cliente
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        if (responseData.error) throw new Error(responseData.error)
        setData([responseData, ...data])
        toast.success(`New ${entityNameLower} created`, {
          position: 'top-center'
        }) // Muestra un mensaje de éxito
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-center'
        }) // Muestra un mensaje de error
      })
  }

  const handleEdit = (editedData) => {
    setEditData(editedData) // Establece los datos del cliente en edición
    setShowEditModal(true) // Muestra el modal de edición
  }

  const handleSaveEdit = () => {
    // eslint-disable-next-line no-unused-vars
    const { firstKey, firstValue, restData } = separateFirstKeyValue(editData)

    // Realiza una solicitud PUT a tu API con los datos editados
    fetch(`${endpoint}/${firstValue}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(restData) // Envía los datos editados del cliente
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        if (responseData.error) throw new Error(responseData.error)

        const newData = data.map((item) => {
          if (item[firstKey] === firstValue) {
            return { ...item, ...restData }
          }
          return item
        })
        setData(newData)
        setShowEditModal(false)
        toast.success(`${entityName} edited`, {
          position: 'top-center'
        }) // Muestra un mensaje de éxito
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-center'
        })
      })
  }

  const handleDelete = (element) => {
    const { firstKey, firstValue } = separateFirstKeyValue(element)

    fetch(`${endpoint}/${firstValue}`, {
      method: 'DELETE'
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        if (responseData.error) throw new Error(responseData.error)

        // Elimina el cliente de la lista de clientes
        const newData = data.filter((item) => item[firstKey] !== firstValue)
        setData(newData)
        toast.success(`${entityName} deleted`, {
          position: 'top-center'
        }) // Muestra un mensaje de éxito
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-center'
        })
      })
  }

  useEffect(() => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch(() =>
        toast.error(`Error al obtener la lista del elemento ${entityName}`, {
          position: 'top-center'
        })
      )
  }, [endpoint])

  return (
    <Container>
      <h1 className='my-5'>{entityName}s</h1>

      <h2 className='mt-5'>Create new {entityNameLower}</h2>

      <CreateEntityForm
        entityName={entityName}
        entityFields={entityFields}
        handleCreate={handleCreate}
      />

      <h2 className='mt-5'>List of {entityNameLower}s</h2>
      <EntityTable
        data={data}
        entityFields={entityFields}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <EditEntityModal
        entityFields={entityFields}
        entityName={entityName}
        showEditModal={showEditModal}
        editData={editData}
        setEditData={setEditData}
        handleSaveEdit={handleSaveEdit}
        handleClose={() => setShowEditModal(false)}
      />

      <ToastContainer />
    </Container>
  )
}

EntityPage.propTypes = {
  entityFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired,
  entityName: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired
}
