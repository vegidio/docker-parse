FROM vegidio/nodejs
LABEL maintainer="Vinicius Egidio <me@vinicius.io>"

# Define the image version
ARG VERSION
ENV IMAGE_VERSION=$VERSION

# Pulling dependencies
ADD src/apps.config.js /var/proxy/ecosystem.config.js
ADD build /var/www/parse
WORKDIR /var/www/parse
RUN yarn --production