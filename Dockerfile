FROM node
MAINTAINER Vinicius Egidio <vegidio@gmail.com>

ADD express /usr/local/parse
WORKDIR /usr/local/parse
RUN npm install

CMD npm start