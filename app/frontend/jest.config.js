module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['jest-fetch-mock'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@app/(.*)$': '<rootDir>/src/$1', 
  },
};
