import { Client as SearchClient } from 'typesense';

export const doctolinkSearchEngine = new SearchClient({
  apiKey: 'KNjTrQaBsQ4IcZoqeaJnrJtm1c8FS98N',
  /**
   * DO NOT USE "masterNode" because:
   * "masterNode" is now consolidated to nodes, starting with Typesense Server v0.12'
   */
  nodes: [
    {
      host: 'se.doctolink.co',
      port: 443,
      protocol: 'https',
    },
  ],
  randomizeNodes: false,
});
