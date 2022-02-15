FROM node:14
ENV NODE_ENV=production

WORKDIR /app

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./

# Installs all node packages
RUN npm install

# Copies everything over to Docker environment
COPY . .

RUN npm run build

# Uses port which is used by the actual application
EXPOSE 3002

# Finally runs the application
CMD [ "npm", "start" ]