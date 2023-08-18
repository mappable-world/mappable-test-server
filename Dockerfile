FROM node:16.15.0-alpine
COPY . .
RUN npm i

CMD ["sh", "-c", "make start"]
