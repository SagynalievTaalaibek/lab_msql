import express from 'express';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import mysqlDb from '../mysqlDb';
import {PlaceMutation} from '../types';

const placesRouter = express.Router();

placesRouter.post('/', async (req, res, next) => {
  try {
    const placeName = req.body.name;

    if (!placeName) {
      return res.status(422).send({error: 'Place name is not passed!'});
    }

    const placeData: PlaceMutation = {
      name: placeName,
      description: req.body.description,
    };

    const [result] = await mysqlDb.getConnection().query(
      'INSERT INTO places (name, description) VALUES (?, ?)',
      [placeData.name, placeData.description],
    ) as ResultSetHeader[];

    return res.send({
      id: result.insertId,
      ...placeData,
    });
  } catch (e) {
    next(e);
  }
});

placesRouter.get('/', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'SELECT id, name FROM places'
    );

    res.send(results);
  } catch (e) {
    next(e);
  }
});

placesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [result] = await mysqlDb.getConnection().query(
      'SELECT * FROM places WHERE id = ?', [id]
    ) as RowDataPacket[];

    const place = result[0];

    if (!place) {
      return res.status(404).send({error: 'Not found!'});
    }

    return res.send(place);
  } catch (e) {
    next(e);
  }
});


placesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const placeName = req.body.name;
    const placeDescription = req.body.description;

    if (!placeName) {
      return res.status(422).send({error: 'Place name is not passed!'});
    }

    const [result] = await mysqlDb.getConnection().query(
      'UPDATE places SET name = ?, description = ? WHERE id = ?',
      [placeName, placeDescription, id]
    ) as ResultSetHeader[];

    if (result.affectedRows === 0) {
      return res.status(404).send({error: 'Place not found!'});
    }

    return res.send({
      id,
      name: placeName,
      description: placeDescription,
    });
  } catch (e) {
    next(e);
  }
});

placesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [items] = await mysqlDb.getConnection().query(
      'SELECT * FROM items WHERE place_id = ?', [id]
    ) as RowDataPacket[];

    if (items.row > 0) {
      return res.status(403).send({error: 'You can not delete this place'});
    }

    const [result] = await mysqlDb.getConnection().query(
      'DELETE FROM places WHERE id = ?',
      [id]
    ) as ResultSetHeader[];

    if (result.affectedRows === 0) {
      return res.status(404).send({error: 'Place not found!'});
    }

    return res.send({message: 'Place deleted!'});
  } catch (e) {
    next(e);
  }
})


export default placesRouter;