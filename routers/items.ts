import express from 'express';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import mysqlDb from '../mysqlDb';
import {imagesUpload} from '../multer';
import {ItemMutation} from '../types';

const itemsRouter = express.Router();

itemsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const categoryId = req.body.category_id;
    const placeId = req.body.place_id;
    const itemName = req.body.name;

    if (!categoryId) {
      return res.status(422).send({error: 'Category id is not passed!'});
    }

    if (!placeId) {
      return res.status(422).send({error: 'Place id is not passed!'});
    }

    if (!itemName) {
      return res.status(422).send({error: 'Item name is not passed!'});
    }

    const [place] = await mysqlDb.getConnection().query(
      'SELECT * FROM places WHERE id = ?', [placeId]
    ) as RowDataPacket[];


    if (!place[0] || place.length[0] === 0) {
      return res.status(404).send({error: 'Place not found'});
    }

    const [categoryResult] = await mysqlDb.getConnection().query(
      'SELECT * FROM categories WHERE id = ?', [categoryId]
    ) as RowDataPacket[];

    if (!categoryResult[0] || categoryResult[0].length === 0) {
      return res.status(404).send({error: 'Category not found'});
    }

    const itemData: ItemMutation = {
      category_id: categoryId,
      place_id: placeId,
      name: itemName,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    };

    const [result] = await mysqlDb.getConnection().query(
      'INSERT INTO items (category_id, place_id, name, description, image) VALUES (?, ?, ?, ?, ?)',
      [itemData.category_id, itemData.place_id, itemData.name, itemData.description, itemData.image],
    ) as ResultSetHeader[];

    return res.send({
      id: result.insertId,
      ...itemData,
    });
  } catch (e) {
    next(e);
  }
});

itemsRouter.get('/', async (req, res, next) => {
  try {
    const [result] = await mysqlDb.getConnection().query(
      'SELECT i.id, i.name, c.name category_name, p.name place_name  FROM items i ' +
      'LEFT JOIN resource.categories c on i.category_id = c.id ' +
      'LEFT JOIN resource.places p on i.place_id = p.id'
    );

    res.send(result);
  } catch (e) {
    next(e);
  }
});

itemsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const [result] = await mysqlDb.getConnection().query(
      'SELECT i.id, i.name, c.name category_name, p.name place_name, i.description, i.image FROM items i ' +
      'LEFT JOIN resource.categories c on i.category_id = c.id ' +
      'LEFT JOIN resource.places p on i.place_id = p.id ' +
      'WHERE i.id = ?', [id]
    ) as RowDataPacket[];

    const item = result[0];

    if (!item) {
      return res.status(404).send({error: 'Not found!'});
    }

    return res.send(item);
  } catch (e) {
    next(e);
  }
});

itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const id = req.params.id;

    const itemData = {
      category_id: req.body.category_id,
      place_id: req.body.place_id,
      name: req.body.name,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    };

    if (!itemData.name) {
      return res.status(422).send({error: 'Item name is not passed!'});
    }

    if (!itemData.place_id) {
      return res.status(422).send({error: 'Place id is not passed!'});
    }

    if (!itemData.category_id) {
      return res.status(422).send({error: 'Category id is not passed!'});
    }

    const [result] = await mysqlDb.getConnection().query(
      'UPDATE items SET name = ?, image = ?, description = ?, place_id = ?,  category_id = ? WHERE id = ?',
      [itemData.name, itemData.image, itemData.description, itemData.place_id, itemData.category_id, id]
    ) as ResultSetHeader[];

    if (result.affectedRows === 0) {
      return res.status(404).send({error: 'Item not found!'});
    }

    return res.send({
      id,
      ...itemData,
    });
  } catch (e) {
    next(e);
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [result] = await mysqlDb.getConnection().query(
      'DELETE FROM items WHERE id = ?',
      [id]
    ) as ResultSetHeader[];

    if (result.affectedRows === 0) {
      return res.status(404).send({error: 'Items not found!'});
    }

    return res.send({message: 'Items deleted!'});
  } catch (e) {
    next(e);
  }
});

export default itemsRouter;