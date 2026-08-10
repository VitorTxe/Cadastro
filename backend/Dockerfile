FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o client do Prisma
RUN npx prisma generate

# Expõe a porta que o servidor Node usa
EXPOSE 3000

# Comando para rodar a aplicação em desenvolvimento (ou npm start para prod)
CMD ["npm", "run", "dev"]
