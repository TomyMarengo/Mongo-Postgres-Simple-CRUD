import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import EntityTable from '../components/EntityTable'; // Asegúrate de importar tu componente EntityTable desde la ubicación correcta

import { fieldMappings } from '../utils/fields';

export default function QueriesPage({ endpoint }) {
  const [queryResults, setQueryResults] = useState({ columns: [], rows: [] });

  const handleQuerySelect = async (queryNumber) => {
    if (!queryNumber) return;

    try {
      const response = await fetch(`${endpoint}/${queryNumber}`); // Reemplaza '/api/queries' con la ruta correcta hacia tus rutas de consultas en la API
      const data = await response.json();

      // Verifica si la respuesta contiene datos
      if (Array.isArray(data) && data.length > 0) {
        // Obtiene los campos desde las claves del primer objeto en los datos
        const fieldNames = Object.keys(data[0]).map((fieldName) => ({
          name: fieldName,
          label: fieldMappings[fieldName] || fieldName, // Usa la etiqueta personalizada si está definida, de lo contrario, usa el nombre del campo
        }));
  
        setQueryResults({ columns: fieldNames, rows: data });
      } else {
        setQueryResults({ columns: [], rows: [] });
      }
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };

  return (
    <Container>
      <h1 className="my-5">Queries Page</h1>

      <select
        className="form-select mb-5"
        id="querySelect"
        onChange={(e) => handleQuerySelect(e.target.value)}
      >
        <option value="">Select a Query</option>
        <option value="1">Query 1: Obtener el teléfono y el número de cliente...</option>
        {/* Agrega más opciones para otras consultas */}
      </select>

      {queryResults.columns.length > 0 && (
        <div>
          <h2>Query Results</h2>
          {console.log(queryResults)}
          <EntityTable data={queryResults.rows} entityFields={queryResults.columns}  />
        </div>
      )}
    </Container>
  );
}

QueriesPage.propTypes = {
  endpoint: PropTypes.string.isRequired,
};