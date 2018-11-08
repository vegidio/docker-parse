FROM node:alpine
MAINTAINER Vinicius Egidio <me@vinicius.io>

ADD express /usr/local/parse
WORKDIR /usr/local/parse
RUN npm install

CMD npm start
