FROM node:latest

COPY package.json ./
COPY secrets.json ./
COPY index.js ./

RUN npm i

CMD ["/bin/sh","node ./index.js"]