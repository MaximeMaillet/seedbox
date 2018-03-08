const form = require('../lib/form');

module.exports = async(original, data, owner) => {

  return form.run(
    original,
    [
      {
        name: 'password',
        value: data.password,
        required: true,
      },
    ],
    owner);
};