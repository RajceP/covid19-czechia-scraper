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
  sourceUrl: string;
}

export interface IRawData {
  testsTotal: string | undefined;
  testsYesterday: string | undefined;
  infectedTotal: string | undefined;
  infectedYesterday: string | undefined;
  infectedToday: string | undefined;
  active: string | undefined;
  healed: string | undefined;
  deceased: string | undefined;
  hospitalized: string | undefined;
  critical: string | undefined;
  infectedDailyRawData: string | undefined;
  testsDailyRawData: string | undefined;
  positivityRatioRawData: string | undefined;
  hospitalizedDailyRawData: string | undefined;
  activeDailyRawData: string | undefined;
  healedDailyRawData: string | undefined;
  deceasedDailyRawData: string | undefined;
}

export interface IPreData {
  infectedDailyPreData: { values: [IXYAxes] };
  testsDailyPreData: { values: [IXYAxes] };
  positivityRatioPreData: { values: [IXYAxes] }[];
  hospitalizedDailyPreData: { values: [IXYAxes] }[];
  activeDailyPreData: { values: [[string, number]] }[];
  healedDailyPreData: { body: [[string, number, number]] };
  deceasedDailyPreData: { body: [[string, number, number]] };
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
