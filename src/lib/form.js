'use strict';

const userService = require('../services/user');

class Form {

  constructor(data, original, errors) {
    this.data = data;
    this.errors = errors;
    this.original = original;
  }

  async flush(model) {
    if(Object.keys(this.data).length > 0) {
      if(this.original) {
        return model.update(this.data, {where: {id: this.original.id}})
      } else {
        return model.create(this.data);
      }
    }

    return this.original;
  }

  /**
   * @return {boolean}
   */
  isSuccess() {
    return this.errors.length === 0;
  }

  /**
   * @return {{}}
   */
  getData() {
    return this.data;
  }

  getErrors() {
    return this.errors;
  }
}

/**
 * @param _original
 * @param values
 * @param owner
 * @param options
 */
module.exports.run = async(_original, values, owner, options) => {

	const original = _original;
	const data = {};
	const errors = [];

  for(const i in values) {
    if(values[i].required && isEmpty(values[i].value)) {
      errors.push({field: values[i].name, error: 'This field cannot be empty'});
    }

    // Check content
    if(isEmpty(values[i].value)) {
      if(values[i].required) {
        continue;
      } else if(!isEmpty(values[i].default) && options.method.toUpperCase() === 'POST') {
        values[i].value = values[i].default;
			} else {
        continue;
			}
		}

		// Check rights
    // @TODO
    if(values[i].canSet) {
      if(!userService.isGranted(owner, values[i].canSet.join(','))) {
        if(options.method.toUpperCase() === 'POST') {
          values[i].value = values[i].default;
        } else {
          values[i].value = original[values[i].name];
        }
      }
    }

		// Transform according to type, if exists
		if(values[i].type) {
			if(values[i].type === 'email') {
        const regexEmail = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
        if(!regexEmail.exec(values[i].value)) {
          errors.push({field: values[i].name, error: 'This email is not correct'});
        }
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