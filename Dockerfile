FROM node:alpine
LABEL maintainer="Vinicius Egidio <me@vinicius.io>"

# Pulling dependencies
ADD build /usr/local/parse
WORKDIR /usr/local/parse
RUN yarn --production

CMD node server.js