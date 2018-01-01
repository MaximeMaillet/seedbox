'use strict';

const userService = require('../services/user');
const roleService = require('../services/role');

const data = {};
const errors = [];
let isSuccess = true;
let original = null;

/**
 * @param _original
 * @param values
 * @param owner
 */
module.exports.run = async(_original, values, owner) => {

	original = _original;

	for(const i in values) {
		// Check content
		if(isEmpty(values[i].value)) {
			if(!isEmpty(values[i].default)) {
				values[i].value = values[i].default;
			} else {
				continue;
			}
		}

		// Check rights
		if(original) {
			if(values[i].canEdit && (!owner || !userService.isGranted(owner, values[i].canEdit, original))) {
				continue;
			}
		}
		else {
			if(values[i].canCreate && (!owner || !userService.isGranted(owner, values[i].canCreate, original))) {
				continue;
			}
		}

		// Transform according to type, if exists
		if(values[i].type) {
			if(values[i].type === 'Role') {
				values[i].value = roleService.transformToMask(values[i].value);
			} else {
				isSuccess = false;
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

	return  module.exports;
};

module.exports.flush = async(model) => {
	if(Object.keys(data).length > 0) {
		if(original) {
			return model.update(data, {where: {id: original.id}})
				.then((success) => {
					if(success) {
						return Object.assign(original.dataValues, data);
					} else {
						return null;
					}
				});
		} else {
			try {
				const user = await model.create(data);
				await user.save();
				return user;
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
module.exports.isSuccess = () => {
	return isSuccess;
};

/**
 * @return {{}}
 */
module.exports.data = () => {
	return data;
};

/**
 * Voire plus tard pour l'ajout de requirements spécifiques
 */
module.exports.errors = () => {
	return errors;
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