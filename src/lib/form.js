const {USER_ROLES} = require('../class/Roles');

const ROLE = {
  NONE: 0,
  ALL: 1,
  OWNER: 2,
  ADMIN: 4,
};

const TYPE = {
  EMAIL: 'email',
};

class Form {
  constructor(original, data, errors) {
    this.data = data;
    this.errors = errors;
    this.original = original;
  }

  /**
   * @param model
   * @returns {Promise<*>}
   */
  async flush(model) {
    console.log('slufh')
    console.log(this.data);
    if(Object.keys(this.data).length > 0) {
      if(this.original) {
        const dataKeys = Object.keys(this.data);
        for(let i=0; i<dataKeys.length; i++) {
          this.original[dataKeys[i]] = this.data[dataKeys[i]];
        }

        return (await this.original.save());
      } else {
        return (await model.create(this.data));
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

  /**
   * @return {{}}
   */
  getOriginal() {
    return this.original;
  }

  /**
   * @returns {{}}
   */
  getErrors() {
    return this.errors;
  }
}

/**
 * @param rules
 * @param original
 * @param data
 * @param owner
 * @param options
 * @returns {Promise<Form>}
 */
module.exports.run = async(rules, original, data, owner, options) => {
	const errors = [];
  const userFormRole = defineFormRole(original, owner);
  const validatedDate = {};

  console.log('run')
  console.log(rules)

  for(let i=0; i<rules.length; i++) {
    // Check rights
    if(!options.create && !(userFormRole & rules[i].canSet)) {
      continue;
    }

    //Transform
    if(rules[i].transform) {
      data[rules[i].name] = rules[i].transform(data[rules[i].name]);
    }

    // Check content
    if(data[rules[i].name] !== undefined && isEmpty(data[rules[i].name]) && rules[i].default) {
      validatedDate[rules[i].name] = rules[i].default;
    }

    // Check required
    if(rules[i].required && isEmpty(data[rules[i].name])) {
      if(rules[i].default) {
        validatedDate[rules[i].name] = rules[i].default;
      } else {
        errors.push({field: rules[i].name, error: 'This field is required'});
      }
      continue;
    }

		// Check correct type
		if(rules[i].type && data[rules[i].name]) {
		  const errorType = checkType(rules[i].type, rules[i].name, data[rules[i].name]);
		  if(errorType) {
        errors.push(errorType);
        continue;
      }
		}

		// everything is good
    if(data[rules[i].name]) {
      validatedDate[rules[i].name] = data[rules[i].name];
    }
	}

	return new Form(original, validatedDate, errors);
};

module.exports.ROLE = ROLE;
module.exports.TYPE = TYPE;

const checkType = (type, field, value) => {
  switch(type) {
    case TYPE.EMAIL:
      const regexEmail = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
      if(!regexEmail.exec(value)) {
        return {field, error: 'This email is uncorrect'};
      }
      return null;
    default:
      return {error: `Type not recognized ${type}`}
  }
};

const defineFormRole = (original, owner) => {
  let userFormRole = ROLE.ALL;
  if(!original || !original.isOwner || (original.isOwner && original.isOwner(owner))) {
    userFormRole |= ROLE.OWNER;
  }
  if(owner && (owner.roles & USER_ROLES.ADMIN)) {
    userFormRole |= ROLE.ADMIN;
  }

  return userFormRole;
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