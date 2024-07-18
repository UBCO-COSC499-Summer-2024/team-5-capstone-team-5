const db = {
    manyOrNone: jest.fn(),
    none: jest.fn(),
    oneOrNone: jest.fn(),
    any: jest.fn()
  };
  
  module.exports = { db };