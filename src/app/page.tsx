// app/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData, ExportData, PillarScore } from '@/types';

export default function AssessmentPage() {
  const [step, setStep] = useState<'name' | 'assessment' | 'result'>('name');
  const [formData, setFormData] = useState<AssessmentData>({
    dataName: '',
    reputation: { impact: 1, likelihood: 1 },
    usage: { impact: 1, likelihood: 1 },
    financial: { impact: 1, likelihood: 1 },
    legal: { impact: 1, likelihood: 1 },
    national: {
      confidentiality: { impact: 1, likelihood: 1 },
      integrity: { impact: 1, likelihood: 1 },
      availability: { impact: 1, likelihood: 1 },
    },
  });

  const impactOptions = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
  ];

  const likelihoodOptions = [
    { value: 1, label: 'Rare - Once a year or less' },
    { value: 2, label: 'Unlikely - Several times a year (2-4 times)' },
    { value: 3, label: 'Possible - Monthly (1-3 times)' },
    { value: 4, label: 'Likely - Weekly (1-3 times)' },
    { value: 5, label: 'Almost Certain - Daily or multiple times' },
  ];

  const calculateNationalScore = () => {
    const subPillars = ['confidentiality', 'integrity', 'availability'];
    const scores = subPillars.map(
      pillar => formData.national[pillar as keyof typeof formData.national].impact * 
                formData.national[pillar as keyof typeof formData.national].likelihood
    );
    return scores.reduce((a, b) => a + b) / 3;
  };

  const calculateRiskScores = () => {
    const mainPillarScores = {
      reputation: formData.reputation.impact * formData.reputation.likelihood,
      usage: formData.usage.impact * formData.usage.likelihood,
      financial: formData.financial.impact * formData.financial.likelihood,
      legal: formData.legal.impact * formData.legal.likelihood,
      national: calculateNationalScore(),
    };

    const totalScore = Object.values(mainPillarScores).reduce((a, b) => a + b) / 5;
    
    return {
      pillarScores: mainPillarScores,
      totalScore,
    };
  };

  const getClassification = (score: number): string => {
    if (score >= 10) return 'TOP SECRET';
    if (score >= 7) return 'SECRET';
    if (score >= 5) return 'CONFIDENTIAL';
    if (score >= 3) return 'INTERNAL';
    return 'PUBLIC';
  };

  const handleExport = () => {
    const { pillarScores, totalScore } = calculateRiskScores();
    
    const exportData: ExportData = {
      ...formData,
      pillarRiskScores: pillarScores,
      totalRiskScore: totalScore,
      classification: getClassification(totalScore),
      assessmentDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.dataName.replace(/\s+/g, '_')}_classification.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderScoreSelector = (
    value: number,
    onChange: (value: number) => void,
    options: { value: number; label: string }[],
    label: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (step === 'name') {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Data Classification Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataName">Name of Data to be Assessed</Label>
              <Input
                id="dataName"
                value={formData.dataName}
                onChange={(e) => setFormData({ ...formData, dataName: e.target.value })}
                placeholder="Enter data name"
              />
            </div>
            <Button 
              onClick={() => setStep('assessment')}
              disabled={!formData.dataName.trim()}
              className="w-full"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { pillarScores, totalScore } = calculateRiskScores();
  const classification = getClassification(totalScore);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 'assessment' ? 'Risk Assessment' : 'Assessment Results'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'assessment' ? (
            <>
              {['reputation', 'usage', 'financial', 'legal'].map((pillar) => (
                <div key={pillar} className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold capitalize">{pillar}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {renderScoreSelector(
                      (formData[pillar as keyof Omit<AssessmentData, 'national'>] as PillarScore).impact,
                      (value) => setFormData({
                        ...formData,
                        [pillar]: { ...(formData[pillar as keyof Omit<AssessmentData, 'national'>] as PillarScore), impact: value }
                      }),
                      impactOptions,
                      'Impact'
                    )}
                    {renderScoreSelector(
                      (formData[pillar as keyof Omit<AssessmentData, 'national'>] as PillarScore).likelihood,
                      (value) => setFormData({
                        ...formData,
                        [pillar]: { ...(formData[pillar as keyof Omit<AssessmentData, 'national'>] as PillarScore), likelihood: value }
                      }),
                      likelihoodOptions,
                      'Likelihood'
                    )}
                  </div>
                </div>
              ))}

              <div className="space-y-4">
                <h3 className="font-semibold">National Interest</h3>
                {['confidentiality', 'integrity', 'availability'].map((subPillar) => (
                  <div key={subPillar} className="space-y-4 border-b pb-4">
                    <h4 className="capitalize">{subPillar}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {renderScoreSelector(
                        formData.national[subPillar as keyof typeof formData.national].impact,
                        (value) => setFormData({
                          ...formData,
                          national: {
                            ...formData.national,
                            [subPillar]: { ...formData.national[subPillar as keyof typeof formData.national], impact: value }
                          }
                        }),
                        impactOptions,
                        'Impact'
                      )}
                      {renderScoreSelector(
                        formData.national[subPillar as keyof typeof formData.national].likelihood,
                        (value) => setFormData({
                          ...formData,
                          national: {
                            ...formData.national,
                            [subPillar]: { ...formData.national[subPillar as keyof typeof formData.national], likelihood: value }
                          }
                        }),
                        likelihoodOptions,
                        'Likelihood'
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => setStep('result')} className="w-full">
                Calculate Classification
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Data Name</h3>
                <p>{formData.dataName}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Risk Scores</h3>
                {Object.entries(pillarScores).map(([pillar, score]) => (
                  <div key={pillar} className="flex justify-between">
                    <span className="capitalize">{pillar}:</span>
                    <span>{score.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Risk Score:</span>
                  <span>{totalScore.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Classification:</span>
                  <span>{classification}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setStep('assessment')} variant="outline" className="w-full">
                  Back to Assessment
                </Button>
                <Button onClick={handleExport} className="w-full">
                  Export Results
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}