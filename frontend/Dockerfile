FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta que o Vite usa
EXPOSE 5173

# Roda o Vite expondo para a rede do Docker
CMD ["npm", "run", "dev", "--", "--host"]
