FROM node:20

WORKDIR /src

COPY . .

RUN npm install
RUN npm start

EXPOSE 3000

CMD ["node","start"] 
