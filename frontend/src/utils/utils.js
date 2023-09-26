export function separateFirstKeyValue (data) {
  const keys = Object.keys(data)
  if (keys.length > 0) {
    const firstKey = keys[0]
    const firstValue = data[firstKey]
    const restData = { ...data }
    delete restData[firstKey] // Elimina la primera clave-valor del objeto restData
    return { firstKey, firstValue, restData }
  }
  return { firstKey: undefined, firstValue: undefined, restData: {} }
}

export function lowerFirstLetter (string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

export function formatCurrency (value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(value)
}

export function formatDate (dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', options)
}
