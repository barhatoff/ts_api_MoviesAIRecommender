import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { pool } from "../database";
import { authHelpers } from "../helpers/auth.helpers";

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) return next({ code: 404 });

      const user = await pool.query(
        `SELECT email, nickname, password_hash FROM users WHERE email = $1`,
        [email]
      );
      if (user.rows.length === 0)
        return next({ code: 401, message: "wrong password or email" });

      const { password_hash, nickname } = user.rows[0];

      const isValid = await bcrypt.compare(password, password_hash);

      if (!isValid)
        return next({ code: 401, message: "wrong password or email" });

      const token = authHelpers.jwtSign({ nickname, email });

      if (!token) return next({ code: 500, message: "cannot sign token" });
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(200).json({ message: "logged in" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nickname, email, password } = req.body;
      if (!nickname || !email || !password) return next({ code: 400 });

      const password_hash = await bcrypt.hash(password, 12);

      const result = await pool.query(
        `INSERT INTO users (nickname, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
        [nickname, email, password_hash]
      );
      if (result.rowCount === 0) return next({ code: 500 });

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
