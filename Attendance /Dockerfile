FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
RUN npm install

COPY backend ./

EXPOSE 8000
CMD ["npm", "run", "start:dev"]
