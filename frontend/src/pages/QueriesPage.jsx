import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import PropTypes from 'prop-types'

import EntityTable from '../components/EntityTable' // Import your EntityTable component

export default function QueriesPage ({ endpoint }) {
  const [queryResults, setQueryResults] = useState({ columns: [], rows: [] })

  const handleQuerySelect = async (queryNumber) => {
    if (!queryNumber) return

    try {
      const response = await fetch(`${endpoint}/${queryNumber}`)
      const data = await response.json()

      setQueryResults(data)
    } catch (error) {
      console.error('Error executing query:', error)
    }
  }

  return (
    <Container>
      <h1 className='my-5'>Queries Page</h1>

      <select
        className='form-select mb-5'
        id='querySelect'
        onChange={(e) => handleQuerySelect(e.target.value)}
      >
        <option value=''>Select a Query</option>
        <option value='1'>
          Query 1: Obtener el teléfono y el número de cliente...
        </option>
        {/* Agrega más opciones para otras consultas */}
      </select>

      {queryResults.columns.length > 0 && (
        <div>
          <h2>Query Results</h2>
          <EntityTable
            data={queryResults.rows}
            entityFields={queryResults.columns}
          />
        </div>
      )}
    </Container>
  )
}

QueriesPage.propTypes = {
  endpoint: PropTypes.string.isRequired
}
