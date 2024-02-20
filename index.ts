import express from 'express';
import mysqlDb from './mysqlDb';

import categoriesRouter from './routers/categories';
import placesRouter from './routers/places';


const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());

app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server listen on ${port} port!`);
  });
};

void run();
