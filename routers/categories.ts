import express from 'express';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import mysqlDb from '../mysqlDb';
import {CategoryMutation} from '../types';

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
      'INSERT INTO categories (name, description) VALUES (?, ?)',
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
      'SELECT id, name FROM categories'
    );

    res.send(results);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [result] = await mysqlDb.getConnection().query(
      'SELECT * FROM categories WHERE id = ?', [id]
    ) as RowDataPacket[];

    const category = result[0];

    if (!category) {
      return res.status(404).send({error: 'Not found!'});
    }

    return res.send(category);
  } catch (e) {
    next(e);
  }
});


categoriesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const categoryName = req.body.name;
    const categoryDescription = req.body.description;

    if (!categoryName) {
      return res.status(422).send({error: 'Category name is not passed!'});
    }

    const [result] = await mysqlDb.getConnection().query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [categoryName, categoryDescription, id]
    ) as ResultSetHeader[];

    if (result.affectedRows === 0) {
      return res.status(404).send({error: 'Category not found!'});
    }

    return res.send({
      id,
      name: categoryName,
      description: categoryDescription,
    });
  } catch (e) {
    next(e);
  }
});

categoriesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [items] = await mysqlDb.getConnection().query(
      'SELECT * FROM items WHERE category_id = ?', [id]
    ) as RowDataPacket[];

    if (items) {
      return res.status(403).send({error: 'You can not delete this category'});
    }

    const [result] = await mysqlDb.getConnection().query(
      'DELETE FROM categories WHERE id = ?',
      [id]
    ) as ResultSetHeader[];

    if (result.affectedRows === 0) {
      return res.status(404).send({error: 'Category not found!'});
    }

    return res.send({message: 'Category deleted!'});
  } catch (e) {
    next(e);
  }
})


export default categoriesRouter;