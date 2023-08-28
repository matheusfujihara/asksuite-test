FROM node:alpine

WORKDIR /usr/src/app

COPY ./package.json .

RUN npm install --omit=dev
RUN npm install -g puppeteer

EXPOSE 3000
COPY . .

CMD ["npm", "start"]
