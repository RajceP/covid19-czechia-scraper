import {
  IActiveDaily,
  IData,
  IDeceasedDaily,
  IHealedDaily,
  IHospitalizedDaily,
  IInfectedByRegion,
  IInfectedDaily,
  IInfectionRateByDistrict,
  IInfectionRateByRegion,
  IPositivityRatio,
  IPreData,
  IRawData,
  ITestsDaily,
  IXYAxes,
} from './types';
import { parseDate } from './utils';

/**
 * Main data parser method.
 * @param $ Cheerio input.
 * @param url Data source url.
 */
export const dataParser = ($: cheerio.Root, url: string): IData => {
  const data: IData = {
    testsTotal: 0,
    testsYesterday: 0,
    infectedTotal: 0,
    infectedYesterday: 0,
    // infectedToday: 0,
    active: 0,
    healed: 0,
    deceased: 0,
    hospitalized: 0,
    critical: 0,
    infectedDaily: [] as Array<IInfectedDaily>,
    testsDaily: [] as Array<ITestsDaily>,
    testsDailyCorrected: [] as Array<ITestsDaily>,
    positivityRatio: [] as Array<IPositivityRatio>,
    hospitalizedDaily: [] as Array<IHospitalizedDaily>,
    activeDaily: [] as Array<IActiveDaily>,
    healedDaily: [] as Array<IDeceasedDaily>,
    deceasedDaily: [] as Array<IDeceasedDaily>,
    infectedByRegion: [] as Array<IInfectedByRegion>,
    infectionRateByRegion: [] as Array<IInfectionRateByRegion>,
    infectionRateByDistrict: [] as Array<IInfectionRateByDistrict>,
    sourceUrl: url,
  };
  const rawData: IRawData = {} as IRawData;
  const preData: IPreData = {} as IPreData;

  /**
   * Method containing cheerio selectors. Prepares raw data.
   */
  const getRawData = () => {
    rawData.testsTotal = $('#count-test')?.attr('data-value');
    rawData.testsYesterday = $('[data-value-tests-yesterday]')?.attr('data-value-tests-yesterday');
    rawData.infectedTotal = $('#count-sick')?.attr('data-value');
    rawData.infectedYesterday = $('[data-value-sick-yesterday]')?.attr('data-value-sick-yesterday');
    // rawData.infectedToday = $('[data-value-sick-today]')?.attr('data-value-sick-today');
    rawData.active = $('#count-active')?.attr('data-value');
    rawData.healed = $('#count-recover')?.attr('data-value');
    rawData.deceased = $('#count-dead')?.attr('data-value');
    rawData.hospitalized = $('#count-hospitalization')?.attr('data-value');
    rawData.infectedDailyRawData = $('#js-total-persons-data')?.attr('data-linechart');
    rawData.testsDailyRawData = $('#js-total-tests-data')?.attr('data-linechart');
    rawData.positivityRatioRawData = $('#js-tests-ratio-data')?.attr('data-linechart');
    rawData.hospitalizedDailyRawData = $('#js-hospitalization-data')?.attr('data-linechart');
    rawData.activeDailyRawData = $('#js-sick-recovered-died-data')?.attr('data-stackedareachart');
    rawData.healedDailyRawData = $('#js-total-recovered-table-data')?.attr('data-table');
    rawData.deceasedDailyRawData = $('#js-total-died-table-data')?.attr('data-table');
    rawData.infectedByRegionRawData = $('#js-total-isin-regions-data')?.attr('data-barchart');
    rawData.infectionRateByRegionRawData = $('#js-relative-isin-regions-data')?.attr('data-map');
    rawData.infectionRateByDistrictRawData = $('#js-relative-isin-districts-last-week-data')?.attr(
      'data-map',
    );
  };

  /**
   * Method is use to parse raw data.
   * @param param0 Deconstructed raw data.
   */
  const getPreData = ({
    infectedDailyRawData,
    testsDailyRawData,
    positivityRatioRawData,
    hospitalizedDailyRawData,
    activeDailyRawData,
    healedDailyRawData,
    deceasedDailyRawData,
    infectedByRegionRawData,
    infectionRateByRegionRawData: infectionRateRawData,
    infectionRateByDistrictRawData,
  }: IRawData) => {
    preData.infectedDailyPreData = infectedDailyRawData ? JSON.parse(infectedDailyRawData) : {};
    preData.testsDailyPreData = testsDailyRawData ? JSON.parse(testsDailyRawData) : {};
    preData.positivityRatioPreData = positivityRatioRawData
      ? JSON.parse(positivityRatioRawData)
      : [];
    preData.hospitalizedDailyPreData = hospitalizedDailyRawData
      ? JSON.parse(hospitalizedDailyRawData)
      : [];
    preData.activeDailyPreData = activeDailyRawData ? JSON.parse(activeDailyRawData) : {};
    preData.healedDailyPreData = healedDailyRawData ? JSON.parse(healedDailyRawData) : {};
    preData.deceasedDailyPreData = deceasedDailyRawData ? JSON.parse(deceasedDailyRawData) : {};
    preData.infectedByRegionPreData = infectedByRegionRawData
      ? JSON.parse(infectedByRegionRawData)
      : {};
    preData.infectionRateByRegionPreData = infectionRateRawData
      ? JSON.parse(infectionRateRawData)
      : [];
    preData.infectionRateByDistrictPreData = infectionRateByDistrictRawData
      ? JSON.parse(infectionRateByDistrictRawData)
      : [];
  };

  /**
   * Method preparing general pandemic data.
   * @param param0 Deconstructed raw data.
   */
  const getGeneralData = ({
    testsTotal,
    testsYesterday,
    infectedTotal,
    infectedYesterday,
    // infectedToday,
    active,
    healed,
    deceased,
    hospitalized,
  }: IRawData) => {
    data.testsTotal = testsTotal ? parseFloat(testsTotal) : 0;
    data.testsYesterday = testsYesterday ? parseFloat(testsYesterday) : 0;
    data.infectedTotal = infectedTotal ? parseFloat(infectedTotal) : 0;
    data.infectedYesterday = infectedYesterday ? parseFloat(infectedYesterday) : 0;
    // data.infectedToday = infectedToday ? parseFloat(infectedToday) : 0;
    data.active = active ? parseFloat(active) : 0;
    data.healed = healed ? parseFloat(healed) : 0;
    data.deceased = deceased ? parseFloat(deceased) : 0;
    data.hospitalized = hospitalized ? parseFloat(hospitalized) : 0;
  };

  /**
   * Method preparing daily infected people data.
   * @param infectedData Pre infected data.
   */
  const getInfectedDaily = (infectedData: { values: [IXYAxes] }) => {
    let infectedTotal = 0;
    infectedData.values.map((infected: IXYAxes) => {
      const infectedItem = {} as IInfectedDaily;
      infectedItem.date = parseDate(infected.x, 'dd.mm.yyyy');
      infectedItem.value = infected.y;
      infectedItem.total = infected.y + infectedTotal;

      infectedTotal += infected.y;

      data.infectedDaily.push(infectedItem);
    });
  };

  /**
   * Method preparing daily tests data.
   * @param testsData Pre test data.
   */
  const getTestsDaily = (testsData: { values: [IXYAxes] }[]) => {
    let testsTotal = 0;
    testsData[0].values.map((tests: IXYAxes) => {
      const testsItem = {} as ITestsDaily;
      testsItem.date = parseDate(tests.x, 'dd.mm.yyyy');
      testsItem.value = tests.y;
      testsItem.total = tests.y + testsTotal;

      testsTotal += tests.y;

      data.testsDaily.push(testsItem);
    });
  };

  /**
   * Method preparing daily tests data.
   * @param testsData Pre test data.
   */
  const getTestsDailyCorrected = (testsData: { values: [IXYAxes] }[]) => {
    let testsTotal = 0;
    testsData[1].values.map((tests: IXYAxes) => {
      const testsItem = {} as ITestsDaily;
      testsItem.date = parseDate(tests.x, 'dd.mm.yyyy');
      testsItem.value = Number(tests.y);
      testsItem.total = Number(tests.y + testsTotal);

      testsTotal += tests.y;

      data.testsDailyCorrected.push(testsItem);
    });
  };

  /**
   * Method preparing positivity rate data.
   * @param positivityData Pre positivity data.
   */
  const getPositivityRatio = (positivityData: { values: [IXYAxes] }[]) => {
    positivityData[0].values.map((positivity: IXYAxes) => {
      const positivityItem = {} as IPositivityRatio;
      positivityItem.date = parseDate(positivity.x, 'dd.mm.yyyy');
      positivityItem.value = positivity.y;

      data.positivityRatio.push(positivityItem);
    });
  };

  /**
   * Nethod preparing hospitalization data.
   * @param hospitalizedData Hospitalized pre data.
   * @param criticalData Critical patiens pre data.
   * @param releasedData Released partiens pre data.
   */
  const getHospitalizedDaily = (
    hospitalizedData: { values: any[] },
    criticalData: { values: any[] },
    releasedData: { values: any[] },
  ) => {
    hospitalizedData.values.map((hospitalized: IXYAxes) => {
      const hospitalizedItem = {} as IHospitalizedDaily;
      hospitalizedItem.date = hospitalized.x;
      hospitalizedItem.hospitalized = hospitalized.y;
      hospitalizedItem.critical = criticalData.values.find((critical: IXYAxes) => {
        return critical.x === hospitalizedItem.date;
      }).y;
      hospitalizedItem.released = releasedData.values.find((released: IXYAxes) => {
        return released.x === hospitalizedItem.date;
      }).y;
      hospitalizedItem.date = parseDate(hospitalizedItem.date, 'dd.mm.yyyy');

      data.hospitalizedDaily.push(hospitalizedItem);
      data.critical = data.hospitalizedDaily[data.hospitalizedDaily.length - 1].critical;
    });
  };

  /**
   * Method preparing active infected data.
   * @param activeData Active pre data.
   */
  const getActiveDaily = (activeData: [string, number][]) => {
    activeData.map((active: [string, number]) => {
      const activeItem = {} as IActiveDaily;
      activeItem.date = parseDate(active[0], 'yyyy-mm-dd');
      activeItem.value = active[1];

      data.activeDaily.push(activeItem);
    });
  };

  /**
   * Method preparing healed infected data.
   * @param healedData Healed pre data.
   */
  const getHealedDaily = (healedData: [string, number, number][]) => {
    healedData.map((healed: [string, number, number]) => {
      const healedItem = {} as IHealedDaily;
      healedItem.date = parseDate(healed[0], 'dd.mm.yyyy');
      healedItem.value = healed[1];
      healedItem.total = healed[2];

      data.healedDaily.push(healedItem);
    });
  };
  /**
   * Method preparing deceased data.
   * @param deceasedData Deceased pre data.
   */
  const getDeceasedDaily = (deceasedData: [string, number, number][]) => {
    deceasedData.map((deceased: [string, number, number]) => {
      const deceasedItem = {} as IDeceasedDaily;
      deceasedItem.date = parseDate(deceased[0], 'dd.mm.yyyy');
      deceasedItem.value = deceased[1];
      deceasedItem.total = deceased[2];

      data.deceasedDaily.push(deceasedItem);
    });
  };

  /**
   * Method preparing total infected by region.
   * @param regionData Region pre data.
   */
  const getInfectedByRegion = (regionData: { values: [IXYAxes] }) => {
    regionData.values.map((region: IXYAxes) => {
      const regionItem = {} as IInfectedByRegion;
      regionItem.name = region.x;
      regionItem.value = region.y;

      data.infectedByRegion.push(regionItem);
    });
  };

  /**
   * Method preparing infection rate by region data.
   * @param rateData Infection rate by region pre data.
   */
  const getInfectionRateByRegion = (rateData: { name: string; relativeValue: number }[]) => {
    rateData.map((rate: { name: string; relativeValue: number }) => {
      const rateItem = {} as IInfectionRateByRegion;
      rateItem.name = rate.name;
      rateItem.value = rate.relativeValue;

      data.infectionRateByRegion.push(rateItem);
    });
  };

  /**
   * Method preparing infection rate by district data.
   * @param rateData Infection rate by district pre data.
   */
  const getInfectionRateByDistrict = (rateData: {
    data: { [key: string]: { name: string; value: number } };
  }) => {
    for (const district in rateData.data) {
      const rateItem = {} as IInfectionRateByDistrict;
      rateItem.name = rateData.data[district].name;
      rateItem.value = rateData.data[district].value;
      data.infectionRateByDistrict.push(rateItem);
    }
  };

  getRawData();
  getPreData(rawData);
  getGeneralData(rawData);
  getInfectedDaily(preData.infectedDailyPreData);
  getTestsDaily(preData.testsDailyPreData);
  getTestsDailyCorrected(preData.testsDailyPreData);
  getPositivityRatio(preData.positivityRatioPreData);
  getHospitalizedDaily(
    preData.hospitalizedDailyPreData[0],
    preData.hospitalizedDailyPreData[1],
    preData.hospitalizedDailyPreData[2],
  );
  getActiveDaily(preData.activeDailyPreData[1].values);
  getHealedDaily(preData.healedDailyPreData.body);
  getDeceasedDaily(preData.deceasedDailyPreData.body);
  getInfectedByRegion(preData.infectedByRegionPreData);
  getInfectionRateByRegion(preData.infectionRateByRegionPreData);
  getInfectionRateByDistrict(preData.infectionRateByDistrictPreData);

  return data;
};
