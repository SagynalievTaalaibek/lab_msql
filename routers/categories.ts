import express from 'express';
import {CategoryMutation} from '../types';
import mysqlDb from '../mysqlDb';
import {ResultSetHeader} from 'mysql2';

const categoriesRouter = express.Router();

categoriesRouter.post('/', async (req, res, next) => {
  try {
    const categoryName = req.body.name;

    if (!categoryName) {
      return res.status(422).send({error: 'Category name is not passed!'});
    }

    const categoryData: CategoryMutation = {
      name: categoryName,
      description: req.body.description,
    };

    const [result] = await mysqlDb.getConnection().query(
      'INSERT INTO categories (name, description)' +
      'VALUES (?, ?)',
      [categoryData.name, categoryData.description],
    ) as ResultSetHeader[];

    return res.send({
      id: result.insertId,
      ...categoryData,
    });
  } catch (e) {
    next(e);
  }
});

categoriesRouter.get('/', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'SELECT * FROM categories'
    );

    res.send(results);
  } catch (e) {
    next(e);
  }
});




export default categoriesRouter;