#FROM node:13.12.0-alpine as development
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#
#RUN npm install --only=development
#RUN npm install rimraf
#COPY . .
#
#RUN npm run build
#
#FROM node:13.12.0-alpine as production
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#
#RUN npm install --only=production
#
#COPY . .
#
#COPY --from=development /usr/src/app/dist ./dist
#
#EXPOSE 4000
#
#CMD ["node", "dist/main"]

FROM node:14-alpine

# Set necessary environment variables.
ENV NODE_ENV=production \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin:$PATH

# For handling Kernel signals properly
RUN apk add --no-cache tini

# Create the working directory, including the node_modules folder for the sake of assigning ownership in the next command
RUN mkdir -p /usr/src/app/node_modules

# Change ownership of the working directory to the node:node user:group
# This ensures that npm install can be executed successfully with the correct permissions
RUN chown -R node:node /usr/src/app

# Set the user to use when running this image
# Non previlage mode for better security (this user comes with official NodeJS image).
USER node

# Set the default working directory for the app
# It is a best practice to use the /usr/src/app directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./
ADD package.json /usr/src/app/package.json
ADD package-lock.json /usr/src/app/package-lock.json
# Install dependencies.
RUN npm i -g @nestjs/cli
#RUN npm ci --only=production
RUN npm ci

# Necessary to run before adding application code to leverage Docker cache
RUN npm cache clean --force
# RUN mv node_modules ../

# Bundle app source
COPY --chown=node:node . ./

# Display directory structure
RUN ls -l

# Expose API port
EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]

# Run the web service on container startup
CMD [ "npm", "start" ]
