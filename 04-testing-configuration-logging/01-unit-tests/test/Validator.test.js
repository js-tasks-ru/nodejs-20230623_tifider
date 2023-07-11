const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('Строка: корректное значение', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 7,
        },
      });

      const errors = validator.validate({name: '123456'});
      const errorsMin = validator.validate({name: '12'});
      const errorsMax = validator.validate({name: '1234567'});

      expect(errors).to.have.length(0);
      expect(errorsMin).to.have.length(0);
      expect(errorsMax).to.have.length(0);
    });

    it('Строка: слишком длинная', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 5,
        },
      });

      const errors = validator.validate({name: '123456'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 6');
    });

    it('Строка: слишком короткая', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({name: '1234'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 4');
    });

    it('Строка: неверный тип', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 1});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('Число: корректное значение', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 30,
        },
      });

      const errors = validator.validate({age: 25});
      const errorsMin = validator.validate({age: 10});
      const errorsMax = validator.validate({age: 30});

      expect(errors).to.have.length(0);
      expect(errorsMin).to.have.length(0);
      expect(errorsMax).to.have.length(0);
    });

    it('Число: слишком большое', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 21});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 10, got 21');
    });

    it('Число: слишком малое', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 9});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 9');
    });

    it('Число: неверный тип', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: '1'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('Два правила: корректные значения', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: '123456', age: 15});

      expect(errors).to.have.length(0);
    });

    it('Два правила: одна ошибка', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: '1', age: 15});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 1');
    });

    it('Два правила: две ошибки', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: '1', age: 1});

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 1');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 10, got 1');
    });

    it('Три правила: корректные значения', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        lastname: {
          type: 'string',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({name: '123456', age: 15, lastname: '123456'});

      expect(errors).to.have.length(0);
    });

    it('Непроверяемые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({name: '123456', age: 15, lastname: '123456'});

      expect(errors).to.have.length(0);
    });

    it('Лишнее правило', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
        age: {
          type: 'number',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({name: '123456'});

      expect(errors).to.have.length(0);
    });


    //тут надо бы поправить - мне кажется, что это ошибка. Не должно возвращать ошибку валидации, если вдруг нету нужного объекта
    it('Поле = undefined', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: '1'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got undefined');
    });

    it('Поле = null', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: null});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got object');
    });

    it('Поле = 0', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 0});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 0');
    });

    it('Без правил', () => {
      const validator = new Validator();

      const errors = validator.validate({age: 0});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('no rules were supplied for validator');
    });

    it('Некорректные правила', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          max: 20,
        },
      });

      const errors = validator.validate({age: 0});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('incorrect rule format, expect type, min and max fields, got type, max');
    });
  });
});
