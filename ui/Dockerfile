# Use an official Node.js runtime as a parent image
FROM node

# Establece el directorio de trabajo en /app
WORKDIR /usr/src/ui

# Copia el archivo package.json e package-lock.json para el contenedor
COPY package*.json .

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

RUN npm run build

EXPOSE 8080

CMD ["sh", "-c", "npm run start"]