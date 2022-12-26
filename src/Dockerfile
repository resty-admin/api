FROM node:16 AS builder
WORKDIR /home
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn run nest-api:build
EXPOSE 3000
ENTRYPOINT ["node", "./dist/app/main.js"]