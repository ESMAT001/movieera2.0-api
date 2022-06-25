const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createHash, compareHash } = require('../hash');
const { v4: uuidv4 } = require('uuid');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',
  body('email').isEmail().normalizeEmail(),
  body('name').not().isEmpty().trim().escape(),
  body('password').isLength({ min: 8 }),
  body('account_type').isIn(['free', 'premium']),
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors: errors.array()
      });
    }

    const User = global.db.user

    const { name, email, password, account_type } = req.body;

    const user = await User.findUnique({
      where: {
        email
      }
    });

    if (user) {
      return res.status(400).json({
        status: 400,
        message: 'User already exists'
      })
    }

    const api_key = uuidv4();
    const data = {
      name,
      email,
      password: createHash(password, process.env.PASSWORD_SALT),
      account_type,
      api_key: createHash(api_key, process.env.API_KEY_SALT),
    }

    try {
      const user = await User.create({ data })
      console.log(user)
      res.send({
        status: 200,
        response: {
          api_key,
        }
      })
    } catch (error) {
      res.status(500).send({
        status: 500,
        errors: [error]
      })
    }

  })

router.post('/reset-password',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('new_password').isLength({ min: 8 }),
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors: errors.array()
      });
    }

    const User = global.db.user

    const { email, password, new_password } = req.body;

    const user = await User.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'user not found!'
      })
    }

    if (!compareHash(password, process.env.PASSWORD_SALT, user.password)) {
      return res.status(400).json({
        status: 400,
        message: 'email or password is incorrect'
      })
    }

    const data = {
      password: createHash(new_password, process.env.PASSWORD_SALT),
    }

    try {
      const user = await User.update({ data, where: { email } })
      console.log(user)
      res.send({
        status: 200,
        response: {
          message: 'Password updated successfully'
        }
      })
    } catch (error) {
      res.status(500).send({
        status: 500,
        errors: [error]
      })
    }

  }
)

module.exports = router;
