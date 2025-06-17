import { Client as SearchClient } from 'typesense';

/**
 * It is important to know that the "env-prod.ts" file is hided.
 * so in yoyr prod environemtn you have to create it or use you own env file as you usually do
 */
export const doctolinkSearchEngine = new SearchClient({
  // Use your own api key
  apiKey: 'use-your-own-api-key',
  /**
   * DO NOT USE "masterNode" because:
   * "masterNode" is now consolidated to nodes, starting with Typesense Server v0.12'
   */
  nodes: [
    {
      // Use you own url where you search engine is stored
      host: 'use-your-own-url',
      port: 443,
      protocol: 'https',
    },
  ],
  randomizeNodes: false,
});

/**
 * Use you own credentials
 *
 * Firebase realtime database is used to store usage data like:
 * How many time the search is triggered
 * How many hits a search triggered
 * How many time a given medication is loaded
 */
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};
