import {
  IActiveDaily,
  IData,
  IDeceasedDaily,
  IHealedDaily,
  IHospitalizedDaily,
  IInfectedDaily,
  IInfectionRate,
  IPositivityRatio,
  IPreData,
  IRawData,
  ITestsDaily,
  IXYAxes,
} from './types';

export const dataParser = ($: cheerio.Root, url: string): IData => {
  const data: IData = {
    testsTotal: 0,
    testsYesterday: 0,
    infectedTotal: 0,
    infectedYesterday: 0,
    infectedToday: 0,
    active: 0,
    healed: 0,
    deceased: 0,
    hospitalized: 0,
    critical: 0,
    infectedDaily: [] as Array<IInfectedDaily>,
    testsDaily: [] as Array<ITestsDaily>,
    positivityRatio: [] as Array<IPositivityRatio>,
    hospitalizedDaily: [] as Array<IHospitalizedDaily>,
    activeDaily: [] as Array<IActiveDaily>,
    healedDaily: [] as Array<IDeceasedDaily>,
    deceasedDaily: [] as Array<IDeceasedDaily>,
    infectionRate: [] as Array<IInfectionRate>,
    sourceUrl: url,
  };
  const rawData: IRawData = {} as IRawData;
  const preData: IPreData = {} as IPreData;

  const getRawData = () => {
    rawData.testsTotal = $('#count-test')?.attr('data-value');
    rawData.testsYesterday = $('[data-value-tests-yesterday]')?.attr('data-value-tests-yesterday');
    rawData.infectedTotal = $('#count-sick')?.attr('data-value');
    rawData.infectedYesterday = $('[data-value-sick-yesterday]')?.attr('data-value-sick-yesterday');
    rawData.infectedToday = $('[data-value-sick-today]')?.attr('data-value-sick-today');
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
    rawData.infectionRateRawData = $('#js-relative-isin-regions-data')?.attr('data-map');
  };

  const getPreData = ({
    infectedDailyRawData,
    testsDailyRawData,
    positivityRatioRawData,
    hospitalizedDailyRawData,
    activeDailyRawData,
    healedDailyRawData,
    deceasedDailyRawData,
    infectionRateRawData: infectedRateRawData,
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
    preData.infectionRatePreData = infectedRateRawData ? JSON.parse(infectedRateRawData) : [];
  };

  const getGeneralData = ({
    testsTotal,
    testsYesterday,
    infectedTotal,
    infectedYesterday,
    infectedToday,
    active,
    healed,
    deceased,
    hospitalized,
  }: IRawData) => {
    data.testsTotal = testsTotal ? parseFloat(testsTotal) : 0;
    data.testsYesterday = testsYesterday ? parseFloat(testsYesterday) : 0;
    data.infectedTotal = infectedTotal ? parseFloat(infectedTotal) : 0;
    data.infectedYesterday = infectedYesterday ? parseFloat(infectedYesterday) : 0;
    data.infectedToday = infectedToday ? parseFloat(infectedToday) : 0;
    data.active = active ? parseFloat(active) : 0;
    data.healed = healed ? parseFloat(healed) : 0;
    data.deceased = deceased ? parseFloat(deceased) : 0;
    data.hospitalized = hospitalized ? parseFloat(hospitalized) : 0;
  };

  const getInfectedDaily = (infectedData: { values: [IXYAxes] }) => {
    let infectedTotal = 0;
    infectedData.values.map((infected: IXYAxes) => {
      const infectedItem = {} as IInfectedDaily;
      infectedItem.date = infected.x;
      infectedItem.value = infected.y;
      infectedItem.total = infected.y + infectedTotal;

      infectedTotal += infected.y;

      data.infectedDaily.push(infectedItem);
    });
  };

  const getTestsDaily = (testsData: { values: [IXYAxes] }) => {
    let testsTotal = 0;
    testsData.values.map((tests: IXYAxes) => {
      const testsItem = {} as ITestsDaily;
      testsItem.date = tests.x;
      testsItem.value = tests.y;
      testsItem.total = tests.y + testsTotal;

      testsTotal += tests.y;

      data.testsDaily.push(testsItem);
    });
  };

  const getPositivityRatio = (positivityData: { values: [IXYAxes] }[]) => {
    positivityData[0].values.map((positivity: IXYAxes) => {
      const positivityItem = {} as IPositivityRatio;
      positivityItem.date = positivity.x;
      positivityItem.value = positivity.y;

      data.positivityRatio.push(positivityItem);
    });
  };

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

      data.hospitalizedDaily.push(hospitalizedItem);
      data.critical = data.hospitalizedDaily[data.hospitalizedDaily.length - 1].critical;
    });
  };

  const getActiveDaily = (activeData: [string, number][]) => {
    activeData.map((active: [string, number]) => {
      const activeItem = {} as IActiveDaily;
      activeItem.date = active[0];
      activeItem.value = active[1];

      data.activeDaily.push(activeItem);
    });
  };

  const getHealedDaily = (healedData: [string, number, number][]) => {
    healedData.map((healed: [string, number, number]) => {
      const healedItem = {} as IHealedDaily;
      healedItem.date = healed[0];
      healedItem.value = healed[1];
      healedItem.total = healed[2];

      data.healedDaily.push(healedItem);
    });
  };

  const getDeceasedDaily = (deceasedData: [string, number, number][]) => {
    deceasedData.map((deceased: [string, number, number]) => {
      const deceasedItem = {} as IDeceasedDaily;
      deceasedItem.date = deceased[0];
      deceasedItem.value = deceased[1];
      deceasedItem.total = deceased[2];

      data.deceasedDaily.push(deceasedItem);
    });
  };

  const getInfectionRate = (
    rateData: { name: string; code: string; color: string; value: number }[],
  ) => {
    rateData.map((rate: { name: string; code: string; color: string; value: number }) => {
      const rateItem = {} as IInfectionRate;
      rateItem.name = rate.name;
      rateItem.value = rate.value;

      data.infectionRate.push(rateItem);
    });
  };

  getRawData();
  getPreData(rawData);
  getGeneralData(rawData);
  getInfectedDaily(preData.infectedDailyPreData);
  getTestsDaily(preData.testsDailyPreData);
  getPositivityRatio(preData.positivityRatioPreData);
  getHospitalizedDaily(
    preData.hospitalizedDailyPreData[0],
    preData.hospitalizedDailyPreData[1],
    preData.hospitalizedDailyPreData[2],
  );
  getActiveDaily(preData.activeDailyPreData[1].values);
  getHealedDaily(preData.healedDailyPreData.body);
  getDeceasedDaily(preData.deceasedDailyPreData.body);
  getInfectionRate(preData.infectionRatePreData);

  // TODO: Regions data.

  return data;
};
