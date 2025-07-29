import { Request, Response, NextFunction } from "express";
import { pool } from "../database";
import axios from "axios";
import { AIHelper } from "../helpers/ai.agent.helper";

export const mainController = {
  addMoviesToWatchedlist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { imdb_id } = req.body;

      const isExistInDb = await pool.query(
        `SELECT * FROM movies WHERE imdb_id = $1`,
        [imdb_id]
      );
      // SET THE MOVIE TO DB FROM IMDB_API IF DONT EXIST
      if (isExistInDb.rows.length === 0) {
        const api_response = await axios.get(
          `http://www.omdbapi.com/?i=${imdb_id}&apikey=43e5488b`
        );

        const { Title, Year, imdbRating, Poster } = api_response.data;
        await pool.query(
          `INSERT INTO movies (imdb_id, title, year, rating, poster) VALUES ($1, $2, $3, $4, $5)`,
          [imdb_id, Title, Year, imdbRating, Poster]
        );
      }

      const result = await pool.query(
        `UPDATE users SET watched_movies = array_append(watched_movies, $1) WHERE email = $2`,
        [imdb_id, res.locals.email]
      );
      if (result.rowCount === 0) return next({ code: 400 });
      return res.status(201).json({ message: "success" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getMoviesFromWatchedlist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = await pool.query(
      `SELECT watched_movies FROM users WHERE email = $1`,
      [res.locals.email]
    );

    res.status(200).json(result.rows[0]);
    try {
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getAllMoviesFromLocalDb: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit = 30, page = 1 } = req.query;

      const limitNum = parseInt(limit as string);
      const pageNum = parseInt(page as string);
      const offset = (pageNum - 1) * limitNum;

      const result = await pool.query(
        `SELECT * FROM movies ORDER BY title LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getRecomendation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { last10 } = req.query;
      const result = await pool.query(
        `SELECT watched_movies FROM users WHERE email = $1`,
        [res.locals.email]
      );
      let watched_movies = result.rows[0]?.watched_movies;
      if (!watched_movies || watched_movies.length === 0)
        return next({
          code: 404,
          message: "your watchlist is empty! watch 'fight club' right now",
        });

      if (last10) {
        watched_movies = watched_movies.slice(-10);
      }
      const watched_movies_row = watched_movies.join(",");
      const jsonRow = await AIHelper.sendResponse(watched_movies_row);
      if (jsonRow) {
        const trimmedJsonRow = jsonRow
          .replace(/^```json\n?/, "")
          .replace(/^```\n?/, "")
          .replace(/\n?```$/, "")
          .trim();
        const result = JSON.parse(trimmedJsonRow);
        res.status(200).json(result);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await pool.query(
        `SELECT id, nickname, email, watched_movies FROM users`
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
