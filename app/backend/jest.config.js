module.exports = {
    roots: ['<rootDir>/src'],
    moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };