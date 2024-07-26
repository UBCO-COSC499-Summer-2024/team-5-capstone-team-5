// app/frontend/src/setupTests.js

import '@testing-library/jest-dom/extend-expect';
import 'jest-fetch-mock';
global.fetch = require('jest-fetch-mock');