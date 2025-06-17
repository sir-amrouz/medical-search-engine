import { formatDate } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getDatabase, increment, ref, update } from 'firebase/database';
import { firebaseConfig } from './env-prod';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

export const setStats = async (
  searchTriggered: number,
  medicsHits: number,
  medicsFound: number,
  hits: any[]
) => {
  /**
   * Folder name based on today date
   * I will  explain the reason for this
   */
  let folderName: string = formatDate(new Date(), 'yy/MM-dd', 'en');

  /**
   * Set search sights
   */
  let allUpdates: any = {};
  allUpdates['overview/searchTriggered'] = increment(searchTriggered);
  allUpdates['overview/medicsHits'] = increment(medicsHits);
  allUpdates['overview/medicsFound'] = increment(medicsFound);

  allUpdates[`overview/dates/${folderName}/searchTriggered`] =
    increment(searchTriggered);
  allUpdates[`overview/dates/${folderName}/medicsHits`] = increment(medicsHits);
  allUpdates[`overview/dates/${folderName}/medicsFound`] =
    increment(medicsFound);

  for (let medic of hits) {
    /**
     * To accurately obtain the number of times a medication was loaded on a given date
     */
    allUpdates[`overview/medics/${medic.document.id}/${folderName}`] =
      increment(1);
  }

  /**
   * Apply all sights
   */
  update(ref(rtdb), allUpdates);
};
