FROM node:20
RUN mkdir -p /workdir
WORKDIR /workdir
COPY package.json /workdir
RUN npm install
COPY . /workdir
CMD ["npm", "start"]