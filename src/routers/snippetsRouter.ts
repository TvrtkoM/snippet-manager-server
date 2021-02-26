import { Request, Response, Router } from 'express';
import Snippet from '../models/snippetModel';
import auth from '../middleware/auth';

const router = Router();

router.use(auth);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, code } = req.body;
    const user = req.user;

    // validation

    if (!(description || code)) {
      return res.status(400).json({ errorMessage: 'At least description or code needed.' });
    }

    const newSnippet = new Snippet({ title, description, code, user });

    const savedSnippet = await newSnippet.save();
    res.send(savedSnippet.toJSON());
  } catch (e) {
    return res.status(500).send();
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const snippets = await Snippet.find({user: req.user});
    res.json(snippets);
  } catch (e) {
    /* handle error */
    return res.status(500).send();
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, description, code } = req.body;
    const id = req.params.id;

    // validation

    if (!(description || code)) {
      return res.status(400).json({ errorMessage: 'At least description or code needed.' });
    }

    if (!id) {
      return res.status(400).json({ errorMessage: 'No id given.' });
    }

    const snippet = await Snippet.findById(id);

    if (snippet == null) {
      return res.status(404).json({ errorMessage: `Snippet with id ${id} not found.` });
    }

    if (snippet.get('user').toString() !== req.user) {
      return res.status(401).json({ errorMessage: `Unauthorized.` });
    }

    snippet.set({ title, description, code });
    snippet.save();

    res.json(snippet);
  } catch (e) {
    /* handle error */
    return res.status(500).send();
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // validation

    if (!id) {
      return res.status(400).json({ errorMessage: 'No id given.' });
    }

    const snippet = await Snippet.findById(id);

    if (snippet == null) {
      return res.status(404).json({ errorMessage: `Snippet with id ${id} not found.` });
    }

    if (snippet.get('user').toString() !== req.user) {
      return res.status(401).json({ errorMessage: `Unauthorized.` });
    }

    await snippet.delete();

    res.json(snippet);
  } catch (e) {
    /* handle error */
    return res.status(500).send();
  }
});

export default router;
