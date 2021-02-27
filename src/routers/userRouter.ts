import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = Router();

const prod = process.env['ENV'] === 'production';

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password, passwordVerify } = req.body;

    // validatin

    const hasAll = (email && password && passwordVerify) != null;
    if (!hasAll) {
      return res.status(400).json({ errorMessage: 'Please enter all required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ errorMessage: 'Enter password at least 6 characters long' });
    }

    if (password !== passwordVerify) {
      return res.status(400).json({ errorMessage: "Passwords don't match" });
    }

    // make sure no user has same email

    const existingUser = await User.findOne({ email });

    if (existingUser != null) {
      return res.status(400).json({ errorMessage: 'User with this email already exists.' });
    }

    // hash the password
    const salt = await bcrypt.genSalt();

    const passwordHash = await bcrypt.hash(password, salt);

    // save the user in database

    await User.create({ email, passwordHash });
    res.status(201).send();

  } catch (e) {
    /* handle error */
    return res.status(500).send();
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validatin

    const hasAll = (email && password) != null;
    if (!hasAll) {
      return res.status(400).json({ errorMessage: 'Please enter all required fields.' });
    }

    // get user account
    const existingUser = await User.findOne({ email });

    if (existingUser == null) {
      return res.status(400).json({ errorMessage: 'Wrong email or password' });
    }

    const correctPassword = await bcrypt.compare(password, existingUser.get('passwordHash').toString());

    if (!correctPassword) {
      return res.status(401).json({ errorMessage: 'Wrong email or password.' });
    }

    // create a JWT token and send instead of the user data
    const jwtData = {
      id: existingUser.get('_id')
    }

    const token = jwt.sign(jwtData, process.env['JWT_SECRET'] as string);

    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: prod ? true : false }).send();
  } catch (e) {
    /* handle error */
    return res.status(500).send();
  }
});


router.get('/who', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (token == null) {
      return res.send(null);
    }

    const user = jwt.verify(token, process.env['JWT_SECRET'] as string) as { id: string };

    return res.send(user.id);
  } catch (e) {
    return res.send(null);
  }
});


router.get('/logout', async (_: Request, res: Response) => {
  try {
    res.clearCookie('token').send();
  } catch (e) {
    res.send(null);
  }
});

export default router;
