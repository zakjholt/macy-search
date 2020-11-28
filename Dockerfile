FROM node:14

WORKDIR /app

COPY .babelrc .babelrc
COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm install
COPY src src

RUN npm run build:app

CMD npm start