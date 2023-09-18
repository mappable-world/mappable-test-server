FROM node:18.17.1-alpine as build

WORKDIR /opt/server

COPY . .

RUN npm ci
RUN npm run build

FROM --platform=linux/amd64 node:18.17.1-alpine as production

ENV PORT 8080
WORKDIR /opt/server

COPY --from=build --chown=api:0 /opt/server/dist dist
COPY --chown=api:api ./docs/ ./docs/
COPY --chown=api:api ./package-lock.json ./package-lock.json
COPY --chown=api:api ./package.json ./package.json

RUN npm ci --production
RUN npm install --global pm2@latest

RUN adduser -D api
USER api

ENV NODE_ENV=production
ENTRYPOINT ["npm", "run", "start:prod"]
CMD []
