FROM node:16.15.0-alpine

WORKDIR /opt/server

COPY . .

RUN npm ci
RUN ./node_modules/.bin/tsc -b tsconfig.json

CMD ["pm2-runtime", "--instances", "max", "dist/index.js"]

RUN npm install --global pm2@latest
