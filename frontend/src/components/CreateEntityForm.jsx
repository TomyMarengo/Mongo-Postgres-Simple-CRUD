import PropTypes from "prop-types";

import { useState } from "react";

export default function CreateEntityForm({
  entityName,
  entityFields,
  handleCreate,
}) {
  const initialData = {}; // Objeto inicial vacío
  entityFields.forEach((field) => {
    initialData[field.name] = ""; // Inicializa todas las propiedades con valores vacíos
  });

  const [newData, setNewData] = useState(initialData);

  const handleInputChange = (e, fieldName) => {
    // Actualiza solo la propiedad correspondiente en newData
    setNewData({ ...newData, [fieldName]: e.target.value });
  };

  return (
    <div>
      <div className="input-group flex-wrap">
        {entityFields.map((field) => (
          <input
            className="form-control"
            key={field.name}
            type={field.type}
            placeholder={field.label}
            value={newData[field.name]}
            onChange={(e) => handleInputChange(e, field.name)}
          />
        ))}
      </div>
      <button
        className="mt-3 w-100 btn btn-primary"
        onClick={() => handleCreate(newData)}
      >
        Create {entityName}
      </button>
    </div>
  );
}

CreateEntityForm.propTypes = {
  entityName: PropTypes.string.isRequired,
  entityFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleCreate: PropTypes.func.isRequired,
};
