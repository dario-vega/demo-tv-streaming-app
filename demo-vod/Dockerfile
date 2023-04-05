# Copyright (c) 2022 Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
#
FROM ghcr.io/oracle/oraclelinux8-nodejs:18

ENV NOSQL_ENDPOINT kvlite
ENV NOSQL_PORT 8080
# ENV NOSQL_ServiceType useInstancePrincipal
# ENV NOSQL_REGION
# ENV NOSQL_COMPID

# Create app directory
RUN useradd -d /usr/src/app -m -s /bin/bash -u 1000 node
WORKDIR /usr/src/app
#RUN  chown node /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
USER node
COPY --chown=node package*.json ./

RUN node --version && \
    npm install && \
    npm install oracle-nosqldb --save
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node . .
EXPOSE 3000
CMD [ "npm", "start" ]
