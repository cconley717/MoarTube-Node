FROM node:21

# Setting up the work directory
WORKDIR /app

# Copying all the files in the project
COPY . .

# Install dependencies
RUN npm install

# Set the port that the node will listen on
ENV PORT=8080

# Expose the node port
EXPOSE 8080

# Start the node
CMD [ "node", "node.js" ]