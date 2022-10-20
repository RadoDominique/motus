# syntax=docker/dockerfile:1

FROM node:16.10.0
ENV NODE_ENV=production


COPY package.json .

RUN npm install --production

COPY . .

CMD [ "node", "readFileExpress.js" ]