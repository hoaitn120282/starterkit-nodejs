const express = require('express');
// const expressJwt = require('express-jwt');
// const config = require('../config');
const userRoutes = require('./user/user.routes');
const rewardRoutes = require('./reward/reward.routes');
const authRoutes = require('./auth/auth.routes');
const historyRoutes = require('./history/history.routes');
const claimRoutes = require('./claim/claim.routes');
const turnsRoutes = require('./turn/turn.routes');
const playerRoutes = require('./player/player.routes');
const withdrawRoutes = require('./withdraw/withdraw.routes');
const depositRoutes = require('./deposit/deposit.routes');
const transactionsHistoryRoutes = require('./transactions-history/transactions_history.routes');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs with jwt token.

// router.use(expressJwt({
//   secret: config.jwtSecret,
//   algorithms: ['HS256'],
//   resultProperty: 'locals.session',
//   getToken: function fromHeaderOrQuerystring(req) {
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//       return req.headers.authorization.split(' ')[1];
//     }
//     if (req.query && req.query.token) {
//       return req.query.token;
//     }
//     return null;
//   },
// }));

// If jwt is valid, storing user data in local session.

// router.use((req, res, next) => {
//   const authorization = req.header('authorization');
//   res.locals.session = JSON.parse(Buffer.from((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
//   next();
// });

// mount all routes at /routeName
router.use('/users', userRoutes);
router.use('/rewards', rewardRoutes);
router.use('/play-history', historyRoutes);
router.use('/claims', claimRoutes);
router.use('/turns', turnsRoutes);
router.use('/players', playerRoutes);
router.use('/withdraw', withdrawRoutes);
router.use('/deposit', depositRoutes);
router.use('/transactions-history', transactionsHistoryRoutes);

module.exports = router;
