FROM node:12-alpine

LABEL version="1.0.0" maintainer="Keerty Verma <keertyverma1303@gmail.com>"

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000
CMD [ "node", "index.js" ]