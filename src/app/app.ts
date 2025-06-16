import { OverlayModule } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { formatDate, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { doctolinkSearchEngine } from '../env/env';
import { log } from 'console';
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

  constructor() {}

  ngOnInit(): void {}

  onTriggerMedicationsSearch = async () => {
    this.isMedicationSearchProgressbarVisible = true;

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
