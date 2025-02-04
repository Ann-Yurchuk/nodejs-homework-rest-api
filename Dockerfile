FROM node

WORKDIR /home

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]
