import { DocumentNode } from 'graphql';
import ApolloClient, { ObservableQuery } from 'apollo-client';

import { RxObservableQuery } from '../../src/RxObservableQuery';
import { RxApolloClient } from '../../src/RxApolloClient';

import gql from 'graphql-tag';
import Cache from 'apollo-cache-inmemory';
import { mockSingleLink } from '../utils/testLinks';

// data

export interface Hero {
  name: string;
}

export interface AllHeroesQueryResult {
  allHeroes: {
    heroes: Hero[];
  };
}

export const query: DocumentNode = gql`
  query heroes {
    allHeroes {
      heroes {
        name
      }
    }
  }
`;
export const data = {
  allHeroes: {
    heroes: [{ name: 'Mr Foo' }, { name: 'Mr Bar' }],
  },
};

export const queryWithVariables: DocumentNode = gql`
  query heroes {
    allHeroes {
      heroes {
        name
      }
    }
  }
`;
export const dataWithVariables = {
  allHeroes: {
    heroes: [{ name: 'Mr Bar' }, { name: 'Mr Foo' }],
  },
};
export const variables = { hero: 'Mr Bar' };

// client

export interface MockedClientResult {
  client: ApolloClient;
  obsQuery: ObservableQuery<any>;
  rxObsQuery: RxObservableQuery<any>;
}

export function mockClient(): MockedClientResult {
  const networkInterface = createNetworkInterface();

  const client = new ApolloClient({ link: networkInterface, cache: new Cache({}), addTypename: false });
  const obsQuery = client.watchQuery<AllHeroesQueryResult>({ query });
  const rxObsQuery = new RxObservableQuery<AllHeroesQueryResult>(obsQuery);

  return {
    client,
    obsQuery,
    rxObsQuery,
  };
}

export interface MockedRxClientResult extends MockedClientResult {
  client: RxApolloClient;
}

export function mockRxClient(): MockedRxClientResult {
  const networkInterface = createNetworkInterface();

  const client = new RxApolloClient({ link: networkInterface, cache: new Cache({}), addTypename: false });
  const obsQuery = client.watchQuery({ query });
  const rxObsQuery = new RxObservableQuery<AllHeroesQueryResult>(obsQuery);

  return {
    client,
    obsQuery,
    rxObsQuery,
  };
}

function createNetworkInterface() {
  return mockSingleLink({
    request: { query },
    result: { data },
  }, {
    request: { query: queryWithVariables, variables },
    result: { data: dataWithVariables },
  });
}
