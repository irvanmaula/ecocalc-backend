FROM node:20-alpine

WORKDIR /src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8084

CMD ["node", "src/app.js"]