FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# CORREÇÃO: Adicione --host 0.0.0.0 para aceitar conexões externas
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]