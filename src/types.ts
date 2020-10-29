export interface IData {
  testsTotal: number;
  testsYesterday: number;
  infectedTotal: number;
  infectedYesterday: number;
  infectedToday: number;
  active: number;
  healed: number;
  deceased: number;
  hospitalized: number;
  critical: number;
  infectedDaily: IInfectedDaily[];
  testsDaily: ITestsDaily[];
  positivityRatio: IPositivityRatio[];
  hospitalizedDaily: IHospitalizedDaily[];
  activeDaily: IActiveDaily[];
  healedDaily: IDeceasedDaily[];
  deceasedDaily: IDeceasedDaily[];
  infectionRate: IInfectionRate[];
  sourceUrl: string;
}

export interface IRawData {
  testsTotal?: string;
  testsYesterday?: string;
  infectedTotal?: string;
  infectedYesterday?: string;
  infectedToday?: string;
  active?: string;
  healed?: string;
  deceased?: string;
  hospitalized?: string;
  critical?: string;
  infectedDailyRawData?: string;
  testsDailyRawData?: string;
  positivityRatioRawData?: string;
  hospitalizedDailyRawData?: string;
  activeDailyRawData?: string;
  healedDailyRawData?: string;
  deceasedDailyRawData?: string;
  infectionRateRawData?: string;
}

export interface IPreData {
  infectedDailyPreData: { values: [IXYAxes] };
  testsDailyPreData: { values: [IXYAxes] };
  positivityRatioPreData: { values: [IXYAxes] }[];
  hospitalizedDailyPreData: { values: [IXYAxes] }[];
  activeDailyPreData: { values: [[string, number]] }[];
  healedDailyPreData: { body: [[string, number, number]] };
  deceasedDailyPreData: { body: [[string, number, number]] };
  infectionRatePreData: { name: string; code: string; color: string; value: number }[];
}

export interface IXYAxes {
  x: string;
  y: number;
}

export interface IInfectedDaily {
  date: string;
  value: number;
  total: number;
}

export interface ITestsDaily {
  date: string;
  value: number;
  total: number;
}

export interface IPositivityRatio {
  date: string;
  value: number;
}

export interface IHospitalizedDaily {
  date: string;
  hospitalized: number;
  critical: number;
  released: number;
}

export interface IActiveDaily {
  date: string;
  value: number;
}

export interface IHealedDaily {
  date: string;
  value: number;
  total: number;
}

export interface IDeceasedDaily {
  date: string;
  value: number;
  total: number;
}

export interface IInfectionRate {
  name: string;
  value: number;
}
