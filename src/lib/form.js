'use strict';

const userService = require('../services/user');
const roleService = require('../services/role');

class Form {

  constructor(data, original, errors) {
    this.data = data;
    this.errors = [];
    this.original = original;
  }

  async flush(model) {
    if(Object.keys(this.data).length > 0) {
      if(this.original) {
        return model.update(this.data, {where: {id: this.original.id}})
          .then((success) => {
            if(success) {
              return Object.assign(this.original.dataValues, this.data);
            } else {
              return null;
            }
          });
      } else {
        try {
          return await model.create(this.data);
        } catch(e) {
          throw e;
        }
      }
    }
  };

  /**
   * Voire plus tard pour l'ajout de requirements spécifiques
   * @return {boolean}
   */
  isSuccess() {
    return this.errors.length === 0;
  };

  /**
   * @return {{}}
   */
  data() {
    return this.data;
  };

  /**
   * Voire plus tard pour l'ajout de requirements spécifiques
   */
  errors() {
    return this.errors;
  };
};

/**
 * @param _original
 * @param values
 * @param owner
 */
module.exports.run = async(_original, values, owner) => {

	const original = _original;
	const data = {};
	const errors = [];

  for(const i in values) {
    // Check content
    if(isEmpty(values[i].value)) {
      if(values[i].required) {
        continue;
      } else if(!isEmpty(values[i].default)) {
        values[i].value = values[i].default;
			} else {
        continue;
			}
		}

		// Check rights
    // @TODO
    if(values[i].canSet) {
      if(!owner) {
        values[i].value = values[i].default;
      }
    }

		// Transform according to type, if exists
		if(values[i].type) {
			if(values[i].type === 'Role') {
				values[i].value = roleService.transformToMask(values[i].value);
			} else {
				errors.push({error: `Type not recognized ${values[i].type}`});
				continue;
			}
		}

		// Check diff + assignation
		if(original) {
			let compare = null;
			switch(typeof original[values[i].name]) {
				case 'object':
					compare = original[values[i].name].toString() !== values[i].value.toString();
					break;
				case 'boolean':
					compare = (original[values[i].name] ? 1 : 0) !== values[i].value;
					break;
				default:
					compare = original[values[i].name] !== values[i].value;
			}

			if(compare) {
				data[values[i].name] = values[i].value;
			}
		} else {
			data[values[i].name] = values[i].value;
		}
	}

	return new Form(data, original, errors);
};

/**
 * Check if value is empty
 * @param value
 * @return {boolean}
 */
function isEmpty(value) {
	if(typeof value === 'boolean') {
		return value === null || value === undefined || value === '';
	} else {
		return !value;
	}
}