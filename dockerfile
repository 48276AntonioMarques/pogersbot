FROM node:lts-slim
WORKDIR /usr/app
COPY ./package.json ./package.json
RUN npm install
COPY ./*.js ./
COPY ./modules ./modules
CMD ["npm", "start"]