# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el contenido del proyecto al contenedor
COPY . .

# Expone el puerto de la aplicación
EXPOSE 8081

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:dev"]
