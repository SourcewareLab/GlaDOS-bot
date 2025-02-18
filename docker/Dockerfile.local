FROM node:22.14.0-alpine3.21

WORKDIR /app

COPY ../package*.json ./

RUN npm install

COPY . .

EXPOSE 9229  # Debug port

CMD ["npm", "run", "start:nodemon"]

