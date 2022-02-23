FROM node:14.15.0-alpine
LABEL MAINTAINER="Baljeet Singh {sharpedge2005@gmail.com}"
LABEL DESC="UI layer for REQUEST-BIN"

ARG APP_NAME=request-bin-app
ARG APP_PORT=5000

# create destination directory
RUN mkdir -p /opt/${APP_NAME}
WORKDIR /opt/${APP_NAME}

# update and install dependency
RUN apk update && apk upgrade
RUN apk add curl

# copy the app, note .dockerignore
COPY . /opt/${APP_NAME}
RUN npm install --production=true

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

ENV NUXT_PORT=${APP_PORT}

# start the app
CMD [ "npm", "start" ]