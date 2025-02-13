// types/index.ts

export interface PillarScore {
  impact: number;
  likelihood: number;
}

export interface NationalInterest {
  confidentiality: PillarScore;
  integrity: PillarScore;
  availability: PillarScore;
}

export interface AssessmentData {
  dataName: string;
  reputation: PillarScore;
  usage: PillarScore;
  financial: PillarScore;
  legal: PillarScore;
  national: NationalInterest;
}

export interface ExportData extends AssessmentData {
  pillarRiskScores: {
    reputation: number;
    usage: number;
    financial: number;
    legal: number;
    national: number;
  };
  totalRiskScore: number;
  classification: string;
  assessmentDate: string;
}