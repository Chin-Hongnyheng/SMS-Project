FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads/lectures

RUN mkdir -p uploads/lectures

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]