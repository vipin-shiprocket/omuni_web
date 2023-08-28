#getting base image ubuntu

FROM ubuntu:focal

LABEL MAINTAINER="DevOps <devops@kartrocket.com>"

RUN apt-get update

RUN apt-get install curl wget vim  -y

ENV NODE_VERSION=18.10.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.39.4/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

RUN npm config set user 0 && npm config set unsafe-perm true && npm i -g  @angular/cli@16.2.0 && ng version

RUN mkdir -p  /var/www/app

WORKDIR /var/www/app
