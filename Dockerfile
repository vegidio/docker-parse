FROM node:alpine
LABEL maintainer="Vinicius Egidio <me@vinicius.io>"

# Installing build dependencies
RUN apk --no-cache --virtual .build-deps add python build-base

ADD express /usr/local/parse
WORKDIR /usr/local/parse
RUN yarn

# Removing build dependencies
RUN apk del .build-deps

CMD yarn start
