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
