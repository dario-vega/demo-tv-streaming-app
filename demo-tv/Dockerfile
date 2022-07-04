FROM node:16-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
ENV NOSQL_ENDPOINT kvlite
ENV NOSQL_PORT 8080
# ENV NOSQL_ServiceType useInstancePrincipal 
# ENV NOSQL_REGION
# ENV NOSQL_COMPID

RUN node --version
RUN npm install
RUN npm install oracle-nosqldb --save
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
