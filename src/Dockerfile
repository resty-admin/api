FROM node:16 AS builder
WORKDIR /home
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn run build-prod
EXPOSE 3000
ENTRYPOINT ["node", "./dist/main.js"]