FROM node:alpine

WORKDIR /usr/src/app

COPY ./package.json .

RUN npm install --omit=dev

EXPOSE 3000

COPY . .

CMD ["npm", "start"]
