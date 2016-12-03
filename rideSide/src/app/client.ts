import { ApolloClient, createNetworkInterface } from 'apollo-client';

// Polyfill fetch
import 'whatwg-fetch';

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/ciw9brm021bfh0171mp8tiric'
});

// The x-graphcool-source header is to let the server know that the example app has started.
// (Not necessary for normal projects)
networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      // Create the header object if needed.
      req.options.headers = {};
    }
    next();
  },
}]);

export const client = new ApolloClient({ networkInterface });
