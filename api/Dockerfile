# Use an official Node.js runtime as a parent image
FROM node

# Establece el directorio de trabajo en /app
WORKDIR /usr/src/api

# Copia el archivo package.json e package-lock.json para el contenedor
COPY package*.json .

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Variables de entorno
ENV NODE_PORT=3000

EXPOSE 3000

# Inicia la aplicación
CMD ["sh", "-c", "npm run start"]