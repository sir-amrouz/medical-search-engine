import { OverlayModule } from '@angular/cdk/overlay';
import { formatDate, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { doctolinkSearchEngine, firebaseConfig } from '../env/env';
import { MatRipple } from '@angular/material/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, increment, ref, set, update } from 'firebase/database';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

@Component({
  selector: 'doctolink-root',
  imports: [
    NgClass,
    FormsModule,
    OverlayModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatRipple,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * Do not remove
   */
  protected title = 'medical-search-engine';

  /**
   * Variable to manage UI & UX
   */
  public isMedicationSearchListVisible: boolean = false;
  public isMedicationSearchProgressbarVisible: boolean = false;
  public medicationTextSearch: string = '';
  public medicationsSearchResult: any[] = [];
  public currentSelectedMedication: any;
  public stats: any = {
    found: 0,
    out_of: 0,
    search_time_ms: 0,
  };
  public searchStats: any = {
    searchTriggered: 0,
    medicsFound: 0,
    medicsHits: 0,
  };

  constructor() {}

  ngOnInit(): void {}

  onTriggerMedicationsSearch = async () => {
    this.isMedicationSearchProgressbarVisible = true;

    /**
     * Init "searchStats" search result
     */
    this.searchStats = {
      searchTriggered: 0,
      medicsFound: 0,
      medicsHits: 0,
    };

    /**
     * Folder name based on today date
     * I will  explain the reason for this
     */
    let folderName: string = formatDate(new Date(), 'yy/ddMM-hh:mm', 'en');

    /**
     * Init "local_medications_search_result" search result
     */
    let local_medications_search_result: any[] = [];

    /**
     * Search start's only when "medication_text_search" in longer then 1
     */
    if (this.medicationTextSearch.length < 3) {
      this.medicationsSearchResult = [];
      this.isMedicationSearchListVisible = false;

      /**
       * Init "stats" search result
       */
      this.stats = {
        found: 0,
        out_of: 0,
        search_time_ms: 0,
      };
      return;
    }

    /**
     * Start reueste FULLTEXT search to the search-engine
     */
    doctolinkSearchEngine
      .collections('medications')
      .documents()
      .search({
        q: this.medicationTextSearch,
        query_by: 'name,inn',
        per_page: 7,
      })
      .then((searchMedicationResults: any) => {
        this.isMedicationSearchListVisible = true;

        let searchTriggered: number = this.searchStats.searchTriggered + 1;
        let medicsHits: number = (this.searchStats.medicsHits +=
          searchMedicationResults.hits.length);
        let medicsFound: number = (this.searchStats.medicsFound +=
          searchMedicationResults.found);

        /**
         * Set search sights
         */
        let allUpdates: any = {};
        allUpdates['overview/searchTriggered'] = increment(searchTriggered);
        allUpdates['overview/medicsHits'] = increment(medicsHits);
        allUpdates['overview/medicsFound'] = increment(medicsFound);

        allUpdates[`overview/dates/${folderName}/searchTriggered`] =
          increment(searchTriggered);
        allUpdates[`overview/dates/${folderName}/medicsHits`] =
          increment(medicsHits);
        allUpdates[`overview/dates/${folderName}/medicsFound`] =
          increment(medicsFound);

        for (let medic of searchMedicationResults.hits) {
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

        this.stats = {
          found: searchMedicationResults.found,
          out_of: searchMedicationResults.out_of,
          search_time_ms: searchMedicationResults.search_time_ms,
        };

        local_medications_search_result = searchMedicationResults.hits as any;
        this.medicationsSearchResult = local_medications_search_result;

        this.isMedicationSearchProgressbarVisible = false;
      });
  };

  onSelectMedicationFromSearchResult = (medication: any) => {
    this.medicationTextSearch = '';

    this.currentSelectedMedication = {
      code: medication.code,
      condition: medication.condition,
      dosage: medication.dosage,
      form: medication.form,
      id: medication.id,
      inn: medication.inn,
      lab: medication.lab,
      name: medication.name,
      rgstrNmbr: medication.rgstrNmbr,
      type: medication.type,
    };

    /**
     * Init "stats" search result
     */
    this.stats = {
      found: 0,
      out_of: 0,
      search_time_ms: 0,
    };

    this.isMedicationSearchListVisible = false;
  };
}
