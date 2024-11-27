FROM node:18-alpine
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . ./
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"