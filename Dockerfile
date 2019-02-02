FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY functions ./functions
COPY keys ./keys

COPY server.js .

EXPOSE 9500
CMD [ "npm", "start" ]