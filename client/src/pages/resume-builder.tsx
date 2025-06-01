import { useState, useEffect } from 'react';
import { Download, User, FileText, Briefcase, GraduationCap, Award, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  degree: string;
  school: string;
  graduationDate: string;
  gpa: string;
}

export default function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([{
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  const [educations, setEducations] = useState<Education[]>([{
    degree: '',
    school: '',
    graduationDate: '',
    gpa: ''
  }]);

  const [skills, setSkills] = useState<string>('');

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setExperiences(prev => [...prev, {
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducations(prev => [...prev, {
      degree: '',
      school: '',
      graduationDate: '',
      gpa: ''
    }]);
  };

  const removeEducation = (index: number) => {
    setEducations(prev => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setEducations(prev => prev.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    ));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const downloadPDF = async () => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      let yPos = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'Your Name';
      doc.text(fullName, margin, yPos);
      yPos += 10;

      // Contact info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const contactInfo = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ');
      if (contactInfo) {
        doc.text(contactInfo, margin, yPos);
        yPos += 15;
      }

      // Summary
      if (personalInfo.summary) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Professional Summary', margin, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(personalInfo.summary, contentWidth);
        doc.text(summaryLines, margin, yPos);
        yPos += summaryLines.length * 5 + 10;
      }

      // Experience
      const validExperiences = experiences.filter(exp => exp.jobTitle || exp.company);
      if (validExperiences.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Work Experience', margin, yPos);
        yPos += 8;

        validExperiences.forEach(exp => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(exp.jobTitle || 'Job Title', margin, yPos);
          yPos += 6;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          const companyDate = `${exp.company || 'Company'} | ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
          doc.text(companyDate, margin, yPos);
          yPos += 6;

          if (exp.description) {
            doc.setFont('helvetica', 'normal');
            const descLines = doc.splitTextToSize(exp.description, contentWidth);
            doc.text(descLines, margin, yPos);
            yPos += descLines.length * 4 + 8;
          } else {
            yPos += 8;
          }
        });
      }

      // Education
      const validEducations = educations.filter(edu => edu.degree || edu.school);
      if (validEducations.length > 0) {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Education', margin, yPos);
        yPos += 8;

        validEducations.forEach(edu => {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(edu.degree || 'Degree', margin, yPos);
          yPos += 6;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          const schoolDate = `${edu.school || 'School'} | ${formatDate(edu.graduationDate)}`;
          doc.text(schoolDate, margin, yPos);
          yPos += 8;
        });
      }

      // Skills
      if (skills.trim()) {
        if (yPos > 220) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Skills', margin, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const skillsLines = doc.splitTextToSize(skills, contentWidth);
        doc.text(skillsLines, margin, yPos);
      }

      const fileName = fullName.replace(/\s+/g, '_').toLowerCase();
      doc.save(`${fileName}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
                <p className="text-sm text-gray-600">Create your professional resume</p>
              </div>
            </div>
            <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="john.doe@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Professional Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Work Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="Tech Company"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                        <div className="mt-2 flex items-center space-x-2">
                          <Checkbox
                            id={`current-${index}`}
                            checked={exp.current}
                            onCheckedChange={(checked) => updateExperience(index, 'current', checked as boolean)}
                          />
                          <Label htmlFor={`current-${index}`} className="text-sm">Current position</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        placeholder="Describe your key responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                    {experiences.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addExperience}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Education</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {educations.map((edu, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div>
                        <Label>School</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(index, 'school', e.target.value)}
                          placeholder="University Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Graduation Date</Label>
                        <Input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>GPA (Optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          placeholder="3.8"
                        />
                      </div>
                    </div>
                    {educations.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addEducation}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="JavaScript, React, Node.js, Python, SQL, Git..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 lg:max-h-screen lg:overflow-y-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-8 shadow-lg rounded-lg min-h-[800px] font-serif">
                  {/* Header */}
                  <div className="border-b-2 border-gray-300 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {personalInfo.firstName || personalInfo.lastName 
                        ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim()
                        : 'Your Name'}
                    </h1>
                    <div className="text-gray-600 mt-2 space-y-1">
                      {personalInfo.email && <div>{personalInfo.email}</div>}
                      {personalInfo.phone && <div>{personalInfo.phone}</div>}
                      {personalInfo.location && <div>{personalInfo.location}</div>}
                    </div>
                  </div>

                  {/* Summary */}
                  {personalInfo.summary && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {experiences.some(exp => exp.jobTitle || exp.company) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                        Work Experience
                      </h2>
                      {experiences.filter(exp => exp.jobTitle || exp.company).map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-medium text-gray-800">
                              {exp.jobTitle || 'Job Title'}
                            </h3>
                            <span className="text-gray-600 text-sm">
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </span>
                          </div>
                          <div className="text-gray-600 italic mb-2">
                            {exp.company || 'Company Name'}
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {educations.some(edu => edu.degree || edu.school) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                        Education
                      </h2>
                      {educations.filter(edu => edu.degree || edu.school).map((edu, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-medium text-gray-800">
                              {edu.degree || 'Degree'}
                            </h3>
                            <span className="text-gray-600 text-sm">
                              {formatDate(edu.graduationDate)}
                            </span>
                          </div>
                          <div className="text-gray-600 italic">
                            {edu.school || 'School Name'}
                            {edu.gpa && ` | GPA: ${edu.gpa}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {skills.trim() && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                        Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {skills.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}