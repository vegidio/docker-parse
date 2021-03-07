### Build image ###
FROM vegidio/nodejs AS BUILD_IMAGE

COPY build /var/www
WORKDIR /var/www
RUN yarn --prod

# Node Prune
RUN apk add curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

### Main Image ###
FROM vegidio/nodejs
LABEL maintainer="Vinicius Egidio <me@vinicius.io>"

# Define the image version
ARG VERSION
ENV IMAGE_VERSION=$VERSION

# Pulling dependencies
COPY src/apps.config.js /var/proxy/ecosystem.config.js
COPY build /var/www
COPY --from=BUILD_IMAGE /var/www/node_modules /var/www/node_modules
WORKDIR /var/www