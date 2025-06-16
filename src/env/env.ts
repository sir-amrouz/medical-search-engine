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

export const firebaseConfig = {
  apiKey: 'AIzaSyADKAicNIK-2St6VNG_Z0vWTRfTO23LoT4',
  authDomain: 'medics-doctolink-os.firebaseapp.com',
  databaseURL:
    'https://medics-doctolink-os-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'medics-doctolink-os',
  storageBucket: 'medics-doctolink-os.firebasestorage.app',
  messagingSenderId: '124904168225',
  appId: '1:124904168225:web:e3059ebdfce5efb2e57c60',
  measurementId: 'G-5Z6ZK9XE91',
};
