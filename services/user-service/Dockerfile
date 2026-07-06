FROM node:23

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 5001

CMD ["npm", "start"]

