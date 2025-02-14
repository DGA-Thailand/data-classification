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

  const impactDescription = new Map<string, string>([
    ['reputation-1', 'น้อย/อย่างจำกัด โดยพิจารณาจาก 1. ส่งผลกระทบเฉพาะภาพลักษณ์หน่วยงาน ใช่หรือไม่ 2. ส่งผลกระทบต่อการรับรู้บทบาทหน้าที่ของหน่วยงาน ใช่หรือไม่ 3. ส่งผลกระทบต่อภาพลักษณ์ของระบบการให้บริการ ใช่หรือไม่'],
    ['reputation-2', 'อย่างร้ายแรง โดยพิจารณาจาก 1. ส่งผลกระทบต่อภาพลักษณ์ของระบบการให้บริการ ใช่หรือไม่ 2. ส่งผลความเชื่อมั่นของผู้ใช้บริการ ใช่หรือไม่ 3. สามารถฟ้องร้องทางคดีแพ่ง ใช่หรือไม่'],
    ['reputation-3', 'อย่างร้ายแรงมาก โดยพิจารณาจาก	1. ส่งผลกระทบต่อภาพลักษณ์ขื่อเสียงของรัฐในระดับประเทศ ใช่หรือไม่ 2. สามารถฟ้องร้องทางคดีแพ่ง ใช่หรือไม่ 3. สามารถฟ้องร้องทางคดีอาญา ใช่หรือไม่'],
    ['usage-1', 'รายบริการ/การดำเนินงานขององค์กร โดยพิจารณาจาก 1. ส่งผลกระทบต่อการทำงานภายในหน่วยงาน ใช่หรือไม่ 2. ส่งผลกระทบต่อประสิทธิภาพการทำงานของผู้ปฏิบัติงานของหน่วยงานลดลง ใช่หรือไม่ 3. ส่งผลการใช้งานของจำนวนผู้ใช้งานในวงแคบ ใช่หรือไม่'],
    ['usage-2', 'ราย Domain/การดำเนินของกระทรวง/ระหว่าง องค์กร/จังหวัด โดยพิจารณาจาก 1. ส่งผลให้เกิดอุปสรรคต่อการทำงานภายในหน่วยงาน และหน่วยงานคู่สัญญา 2. ส่งผลต่อประสิทธิภาพการให้บริการของระบบ 3. บางบริการมีความไม่สะดวก หรือล่าช้า เสียเวลา แต่ยังไม่สูญเสียข้อมูล ใช่หรือไม่ 4. ส่งผลกระทบต่อผู้ใช้บริการบางส่วน ใช่หรือไม่ '],
    ['usage-3', 'Cross Domains,  Sectors, Region/การดำเนินงานตามแผนบูรณาการ/กลุ่มจังหวัด โดยพิจารณาจาก 1. ส่งผลกระทบต่อการทำงานภายในหน่วยงานเครือข่ายมากกว่า 2 หน่วยงาน ใช่หรือไม่  2. ส่งผลกระทบต่อผู้มาใช้บริการทุกคน และกระทบวงกว้างในระดับประเทศ ใช่หรือไม่ 3. ระบบล่มหรือใช้งานไม่ได้ ทำให้เกิดความเสียหายของผู้ใช้บริการ ใช่หรือไม่ 4. ข้อมูลในระบบสูญหายและไม่สามารถกู้คืนมา ใช่หรือไม่'],
    ['financial-1', 'มูลค่าไม่เกิน 5 ล้าน/ Small project โดยพิจารณาจาก มูลค่าความเสียหายของการให้บริการหรือโครงการ เช่น ค่าดำเนินการ เช่น ค่าปรับ ค่าเยียวยา ค่าเสียหาย โดยมีมูลค่าไม่เกิน 5 ล้าน ใช่หรือไม่ ทั้งนี้ การพิจารณาเป็นตัวเงินและความสูญเสียหายของ Asset อาจเป็นเรื่องบทลงโทษทางกฎหมาย มูลค่าความเสียหาย ค่าดำเนินการต่างๆ'],
    ['financial-2', ' ตั้งแต่ 5 ล้าน แต่ไม่ถึง 100  ล้าน/ Medium project โดยพิจารณาจาก มูลค่าความเสียหายของการให้บริการหรือโครงการ เช่น ค่าดำเนินการ เช่น ค่าปรับ ค่าเยียวยา ค่าเสียหาย โดยมีมูลค่า ตั้งแต่ 5 ล้าน แต่ไม่ถึง 50 ล้านบาท ใช่หรือไม่ ทั้งนี้ การพิจารณาเป็นตัวเงินและความสูญเสียหายของ Asset อาจเป็นเรื่องบทลงโทษทางกฎหมาย มูลค่าความเสียหาย ค่าดำเนินการต่างๆ'],
    ['financial-3', 'ตั้งแต่ 100 ล้านบาท ขึ้นไป / Large Project โดยพิจารณาจาก	มูลค่าความเสียหายของการให้บริการหรือโครงการ เช่น ค่าดำเนินการ เช่น ค่าปรับ ค่าเยียวยา ค่าเสียหาย โดยมีมูลค่า ตั้งแต่ 100 ล้านบาท ใช่หรือไม่ ทั้งนี้ การพิจารณาเป็นตัวเงินและความสูญเสียหายของ Asset อาจเป็นเรื่องบทลงโทษทางกฎหมาย มูลค่าความเสียหาย ค่าดำเนินการต่างๆ'],
    ['legal-1', 'ละเว้นการปฏิบัติตามระเบียบข้อบังคับขององค์กร ซึ่งเกิดผลกระทบน้อย โดยพิจารณาจาก	1. ไม่ปฏิบัติตามกฎระเบียบระดับองค์กร ใช่หรือไม่ 2. ส่งผลให้หน่วยงานได้รับบทลงโทษของหน่วยงาน ใช่หรือไม่'],
    ['legal-2', 'ละเว้นการปฏิบัติตามระเบียบข้อบังคับและกฎกระทรวง ซึ่งเกิดผลกระทบที่มีนัยสำคัญ 1. และไม่เป็นไปตามเป้าของ ก.พ.ร. โดยพิจารณาจาก	ไม่ปฏิบัติตามกฎระเบียบระดับกระทรวง เช่น กฎกระทรวง ใช่หรือไม่ 2. ส่งผลให้หน่วยงานได้รับบทลงโทษทางอาญาและทางแพ่ง หรือ โทษทางปกครอง ใช่หรือไม่'],
    ['legal-3', 'ละเว้นการปฏิบัติตามกฎหมาย มติ ครม. หรือระเบียบข้อบังคับ ซึ่งเกิดผลกระทบที่มีนัยสำคัญ และไม่เป็นไปตามเป้าของแผนบูรณาการ/กลุ่มจังหวัด โดยพิจารณาจาก 1. ไม่ปฏิบัติตามกฎหมายอย่างชัดเจน หรือไม่ปฏิบัติตามมติ ครม. รัฐบาล  และไม่เป็นไปตามเป้าหมายของแผนบูรณการ ใช่หรือไม่ 2. ไม่ปฏิบัติตามกฎหมายส่งผลให้หน่วยงานได้รับบทลงโทษทางอาญาและทางแพ่ง หรือ โทษทางปกครอง ใช่หรือไม่'],
    ['nationalInterest', ''],
    ['confidentiality-0', 'การรักษาข้อจำกัดในการได้รับอนุญาตให้เข้าถึงได้และเปิดเผยเฉพาะผู้มีสิทธิ์ รวมทั้งวิธีการคุ้มครองความเป็นส่วนตัว (privacy) และกรรมสิทธิ์ (proprietary) ของข้อมูลข่าวสาร'],
    ['confidentiality-1', 'Low: การเปิดเผยข้อมูลโดยไม่ได้รับอนุญาตอาจส่งผลกระทบน้อย/อย่างจำกัด (limited) และเกิดผลประโยชน์แห่งชาติสำคัญน้อย (Less Important or Secondary National Interests)'],
    ['confidentiality-2', 'Medium: การเปิดเผยข้อมูลโดยไม่ได้รับอนุญาตอาจส่งผลกระทบอย่างร้ายแรง (serious) และเกิดผลประโยชน์แห่งชาติที่สำคัญ (Important National Interests)'], 
    ['confidentiality-3', 'High: การเปิดเผยข้อมูลโดยไม่ได้รับอนุญาตอาจส่งผลกระทบอย่างร้ายแรงมาก (severe or catastrophic) และเกิดผลประโยชน์แห่งชาติสำคัญยิ่ง (Extremely Important National Interests)'],
    ['integrity-0', 'การปกป้องจากการดัดแปลงหรือทำลายข้อมูลที่ไม่เหมาะสม และรวมถึงการรับรองว่าข้อมูลจะไม่ถูกปฏิเสธ (non-repudiation) และเป็นข้อมูลที่ถูกต้องเป็นความจริง (authenticity)'],
    ['integrity-1', 'Low: การแก้ไขหรือทำลายข้อมูลโดยไม่ได้รับอนุญาตอาจส่งผลกระทบน้อย/อย่างจำกัด (limited) และเกิดผลประโยชน์แห่งชาติสำคัญน้อย (Less Important or Secondary National Interests) '],
    ['integrity-2', 'Medium: การแก้ไขหรือทำลายข้อมูลโดยไม่ได้รับอนุญาตอาจส่งผลกระทบอย่างร้ายแรง (serious) และเกิดผลประโยชน์แห่งชาติที่สำคัญ (Important National Interests)'],
    ['integrity-3', 'High: การแก้ไขหรือทำลายข้อมูลโดยไม่ได้รับอนุญาตอาจส่งผลกระทบอย่างร้ายแรงมาก (severe or catastrophic) และเกิดผลประโยชน์แห่งชาติสำคัญยิ่ง (Extremely Important National Interests) '],
    ['availability-0', 'การสร้างความมั่นใจในการเข้าถึงและการใช้ข้อมูลอย่างทันท่วงที/เป็นปัจจุบันและเชื่อถือได้'],
    ['availability-1', 'Low: การหยุดชะงักของการเข้าถึงหรือการใช้ข้อมูลข่าวสารหรือระบบสารสนเทศอาจส่งผลกระทบน้อย/อย่างจำกัด (limited) และเกิดผลประโยชน์แห่งชาติสำคัญน้อย (Less Important or Secondary National Interests) '],
    ['availability-2', 'Medium: การหยุดชะงักของการเข้าถึงหรือการใช้ข้อมูลข่าวสารหรือระบบสารสนเทศอาจส่งผลกระทบอย่างร้ายแรง (serious) และเกิดผลประโยชน์แห่งชาติที่สำคัญ (Important National Interests)'],
    ['availability-3', 'High: การหยุดชะงักของการเข้าถึงหรือการใช้ข้อมูลข่าวสารหรือระบบสารสนเทศอาจส่งผลกระทบอย่างร้ายแรงมาก (severe or catastrophic) และเกิดผลประโยชน์แห่งชาติสำคัญยิ่ง (Extremely Important National Interests) ']
  ]);

  const likelihoodOptions: Option[] = [
    { value: '1', label: 'Level 1: แทบจะไม่เกิด (เช่น อย่างมากปีละ 1 ครั้ง)' },
    { value: '2', label: 'Level 2: โอกาสเกิดน้อย (เช่น ไม่เกินปีละ 2 ครั้ง)' },
    { value: '3', label: 'Level 3: ปานกลาง (เช่น ปีละ 3-5 ครั้ง)' },
    { value: '4', label: 'Level 4: ค่อนข้างบ่อย (เช่น ปีละ 6-10 ครั้ง)' },
    { value: '5', label: 'Level 5: เกิดเป็นประจำ (เช่น อย่างน้อยเดือนละครั้ง)' }
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
    const niImpact = Math.round(
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
                <div className="text-sm space-y-2">คำนิยามระดับ impact</div>
                <ul className="text-sm list-disc pl-6">
                  <li>Low: {impactDescription.get(pillar+"-1")}</li>
                  <li>Medium: {impactDescription.get(pillar+"-2")}</li>
                  <li>High: {impactDescription.get(pillar+"-3")}</li>
                </ul>
                <br></br>
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
                      <div className="text-sm space-y-2">
                      <p>{impactDescription.get(subPillar+"-0")}</p>
                        <ul className="list-disc pl-6">
                          <li>{impactDescription.get(subPillar+"-1")}</li>
                          <li>{impactDescription.get(subPillar+"-2")}</li>
                          <li>{impactDescription.get(subPillar+"-3")}</li>
                        </ul>
                      </div>
                        <br></br>
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