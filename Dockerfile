FROM node

COPY package.json ./
COPY secrets.json ./
COPY index.js ./

WORKDIR .

RUN npm i
