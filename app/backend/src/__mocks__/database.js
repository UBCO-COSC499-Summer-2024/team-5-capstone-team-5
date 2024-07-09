const db = {
    manyOrNone: jest.fn(),
    oneOrNone: jest.fn(),
    none: jest.fn(),
    any: jest.fn(),
};

module.exports = { db };