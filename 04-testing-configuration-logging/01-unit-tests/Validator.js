module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    if (!this.rules) {
      return [{error: 'no rules were supplied for validator'}];
    }

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      if (!rules.hasOwnProperty('type') || !rules.hasOwnProperty('min') || !rules.hasOwnProperty('max')) {
        return [{error: `incorrect rule format, expect type, min and max fields, got ${Object.keys(rules).join(', ')}`}];
      }

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.min}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
