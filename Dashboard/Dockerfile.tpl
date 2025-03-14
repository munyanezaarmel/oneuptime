#
# Dashboard Dockerfile
#

# Pull base image nodejs image.
FROM node:21.2-alpine3.18
USER root
RUN mkdir /tmp/npm &&  chmod 2777 /tmp/npm && chown 1000:1000 /tmp/npm && npm config set cache /tmp/npm --global


ARG GIT_SHA
ARG APP_VERSION

ENV GIT_SHA=${GIT_SHA}
ENV APP_VERSION=${APP_VERSION}


# Install bash. 
RUN apk add bash && apk add curl

#Use bash shell by default
SHELL ["/bin/bash", "-c"]


RUN mkdir /usr/src

WORKDIR /usr/src/Common
COPY ./Common/package*.json /usr/src/Common/
RUN npm install
COPY ./Common /usr/src/Common


WORKDIR /usr/src/Model
COPY ./Model/package*.json /usr/src/Model/
RUN npm install
COPY ./Model /usr/src/Model



WORKDIR /usr/src/CommonServer
COPY ./CommonServer/package*.json /usr/src/CommonServer/
RUN npm install
COPY ./CommonServer /usr/src/CommonServer




# Install CommonUI

WORKDIR /usr/src/CommonUI
COPY ./CommonUI/package*.json /usr/src/CommonUI/
RUN npm install --force
COPY ./CommonUI /usr/src/CommonUI


ENV PRODUCTION=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /usr/src/app

# Install app dependencies
COPY ./Dashboard/package*.json /usr/src/app/
RUN npm install  

# Expose ports.
#   - 3009:  Dashboard
EXPOSE 3009

{{ if eq .Env.ENVIRONMENT "development" }}
#Run the app
RUN mkdir /usr/src/app/dev-env
RUN touch /usr/src/app/dev-env/.env
CMD [ "npm", "run", "dev" ]
{{ else }}
# Copy app source
COPY ./Dashboard /usr/src/app
# Bundle app source
RUN npm i webpack-cli
RUN npm run build
#Run the app
CMD [ "npm", "start" ]
{{ end }}
