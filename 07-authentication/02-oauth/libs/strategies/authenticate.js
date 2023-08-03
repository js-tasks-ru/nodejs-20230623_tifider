const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  const user = await User.findOne({email});

  if (user) return done(null, user);

  if (!user) {
    try {
      const user = await User.create({email, displayName});

      return done(null, user);
    } catch (error) {
      return done(error, null, 'Некорректный email.');
    }
  }

  done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
