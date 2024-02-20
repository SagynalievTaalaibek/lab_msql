import express from 'express';
import {imagesUpload} from '../multer';
import {ItemMutation} from '../types';
import mysqlDb from '../mysqlDb';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

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

  } catch (e) {
    next(e);
  }
});

itemsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

  } catch (e) {
    next(e);
  }
});

itemsRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

  } catch (e) {
    next(e);
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

  } catch (e) {
    next(e);
  }
});

export default itemsRouter;