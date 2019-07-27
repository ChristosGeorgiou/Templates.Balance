import * as _package from '../../package.json';
import * as _plugins from './plugins.json';

export const environment = {
  production: false,
  plugins: _plugins['plugins'],
  version: _package['version'],
  servers: [
    {
      label: "Demo Server",
      url: 'http://localhost:3000/api'
    }
  ]
}

export default environment
