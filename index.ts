import express from 'express';
import mysqlDb from './mysqlDb';

import categoriesRouter from './routers/categories';
import placesRouter from './routers/places';
import itemsRouter from './routers/items';


const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());

app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);
app.use('/items', itemsRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server listen on ${port} port!`);
  });
};

void run();
