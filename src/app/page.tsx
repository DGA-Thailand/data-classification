// app/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PillarData {
  likelihood: string;
  impact: string;
}

interface NationalInterestData extends PillarData {
  confidentiality: string;
  integrity: string;
  availability: string;
}

interface FormData {
  dataName: string;
  reputation: PillarData;
  usage: PillarData;
  financial: PillarData;
  legal: PillarData;
  nationalInterest: NationalInterestData;
}

interface RiskScores {
  reputation: number;
  usage: number;
  financial: number;
  legal: number;
  nationalInterest: number;
}

interface AssessmentResult {
  dataName: string;
  risks: RiskScores;
  niImpact: number;
  totalRisk: number;
  classification: string;
}

interface Option {
  value: string;
  label: string;
}

const DataClassificationTool = () => {
  const [formData, setFormData] = useState<FormData>({
    dataName: '',
    reputation: { likelihood: '1', impact: '1' },
    usage: { likelihood: '1', impact: '1' },
    financial: { likelihood: '1', impact: '1' },
    legal: { likelihood: '1', impact: '1' },
    nationalInterest: {
      likelihood: '1',
      impact: '1',
      confidentiality: '1',
      integrity: '1',
      availability: '1'
    }
  });

  const [result, setResult] = useState<AssessmentResult | null>(null);

  const likelihoodOptions: Option[] = [
    { value: '1', label: 'Level 1: Rare (Once a year or less)' },
    { value: '2', label: 'Level 2: Unlikely (2-4 times a year)' },
    { value: '3', label: 'Level 3: Possible (1-3 times monthly)' },
    { value: '4', label: 'Level 4: Likely (1-3 times weekly)' },
    { value: '5', label: 'Level 5: Almost Certain (Daily or more)' }
  ];

  const impactOptions: Option[] = [
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' }
  ];

  const handleInputChange = (pillar: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [pillar]: { ...(prev[pillar] as PillarData), [field]: value }
    }));
  };

  const calculateRisk = (): AssessmentResult => {
    const niImpact = Math.ceil(
      (parseInt(formData.nationalInterest.confidentiality) +
        parseInt(formData.nationalInterest.integrity) +
        parseInt(formData.nationalInterest.availability)) / 3
    );

    const risks: RiskScores = {
      reputation: parseInt(formData.reputation.likelihood) * parseInt(formData.reputation.impact),
      usage: parseInt(formData.usage.likelihood) * parseInt(formData.usage.impact),
      financial: parseInt(formData.financial.likelihood) * parseInt(formData.financial.impact),
      legal: parseInt(formData.legal.likelihood) * parseInt(formData.legal.impact),
      nationalInterest: parseInt(formData.nationalInterest.likelihood) * niImpact
    };

    const totalRisk = Math.ceil(
      Object.values(risks).reduce((sum, risk) => sum + risk, 0) / 5
    );

    let classification: string;
    if (totalRisk >= 10) classification = 'Top Secret';
    else if (totalRisk >= 7) classification = 'Secret';
    else if (totalRisk >= 5) classification = 'Confidential';
    else if (totalRisk >= 3) classification = 'Internal';
    else classification = 'Public';

    return {
      dataName: formData.dataName,
      risks,
      niImpact,
      totalRisk,
      classification
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateRisk();
    setResult(result);
  };

  const exportResult = () => {
    if (!result) return;

    const headers = [
      'Timestamp',
      'Data Name',
      'Classification',
      'Total Risk Score',
      'Reputation Risk Score',
      'Reputation Likelihood',
      'Reputation Impact',
      'Usage Risk Score',
      'Usage Likelihood',
      'Usage Impact',
      'Financial Risk Score',
      'Financial Likelihood',
      'Financial Impact',
      'Legal Risk Score',
      'Legal Likelihood',
      'Legal Impact',
      'National Interest Risk Score',
      'National Interest Likelihood',
      'National Interest Confidentiality',
      'National Interest Integrity',
      'National Interest Availability',
      'National Interest Impact'
    ].join(',');

    const data = [
      new Date().toISOString(),
      result.dataName,
      result.classification,
      result.totalRisk,
      result.risks.reputation,
      formData.reputation.likelihood,
      formData.reputation.impact,
      result.risks.usage,
      formData.usage.likelihood,
      formData.usage.impact,
      result.risks.financial,
      formData.financial.likelihood,
      formData.financial.impact,
      result.risks.legal,
      formData.legal.likelihood,
      formData.legal.impact,
      result.risks.nationalInterest,
      formData.nationalInterest.likelihood,
      formData.nationalInterest.confidentiality,
      formData.nationalInterest.integrity,
      formData.nationalInterest.availability,
      result.niImpact
    ].map(value => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');

    const csvContent = `${headers}\n${data}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classification-${result.dataName.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Classification Assessment Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dataName">Data Name</Label>
              <Input
                id="dataName"
                value={formData.dataName}
                onChange={(e) => setFormData(prev => ({ ...prev, dataName: e.target.value }))}
                required
                placeholder="Enter data name"
              />
            </div>

            {(['reputation', 'usage', 'financial', 'legal'] as const).map((pillar) => (
              <div key={pillar} className="space-y-4 border p-4 rounded-lg">
                <h3 className="text-lg font-semibold capitalize">{pillar} Risk Assessment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Likelihood</Label>
                    <Select
                      value={formData[pillar].likelihood}
                      onValueChange={(value) => handleInputChange(pillar, 'likelihood', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select likelihood" />
                      </SelectTrigger>
                      <SelectContent>
                        {likelihoodOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Impact</Label>
                    <Select
                      value={formData[pillar].impact}
                      onValueChange={(value) => handleInputChange(pillar, 'impact', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select impact" />
                      </SelectTrigger>
                      <SelectContent>
                        {impactOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">National Interest Risk Assessment</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Likelihood</Label>
                  <Select
                    value={formData.nationalInterest.likelihood}
                    onValueChange={(value) => handleInputChange('nationalInterest', 'likelihood', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      {likelihoodOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(['confidentiality', 'integrity', 'availability'] as const).map((subPillar) => (
                    <div key={subPillar} className="space-y-2">
                      <Label className="capitalize">{subPillar}</Label>
                      <Select
                        value={formData.nationalInterest[subPillar]}
                        onValueChange={(value) => handleInputChange('nationalInterest', subPillar, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                        <SelectContent>
                          {impactOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">Calculate Classification</Button>
          </form>

          {result && (
            <div className="mt-6 space-y-4">
              <Alert>
                <AlertTitle>Classification Result</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Data Name:</strong> {result.dataName}</p>
                    <p><strong>Classification:</strong> {result.classification}</p>
                    <p><strong>Total Risk Score:</strong> {result.totalRisk}</p>
                    <p><strong>Individual Risk Scores:</strong></p>
                    <ul className="list-disc pl-6">
                      <li>Reputation: {result.risks.reputation}</li>
                      <li>Usage: {result.risks.usage}</li>
                      <li>Financial: {result.risks.financial}</li>
                      <li>Legal: {result.risks.legal}</li>
                      <li>National Interest: {result.risks.nationalInterest} (Impact: {result.niImpact})</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
              <Button onClick={exportResult} className="w-full">Export Results</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataClassificationTool;