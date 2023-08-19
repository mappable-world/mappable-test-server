FROM node:16.15.0-alpine

WORKDIR /opt/server

COPY . .

RUN npm ci
RUN npm run build

CMD ["pm2-runtime", "--instances", "max", "dist/index.js"]

RUN npm install --global pm2@latest
