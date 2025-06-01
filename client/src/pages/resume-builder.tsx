import { useState, useEffect } from 'react';
import { Download, FileDown, User, FileText, Briefcase, GraduationCap, Award, Plus, Trash2, Globe, Github, Linkedin } from 'lucide-react';
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
  linkedin: string;
  github: string;
  website: string;
}

interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

interface Education {
  school: string;
  degree: string;
  location: string;
  graduationYear: string;
  gpa: string;
}

interface Certification {
  title: string;
  year: string;
  organization: string;
}

interface Skills {
  technical: string;
  languages: string;
  interests: string;
}

export default function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([{
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    bulletPoints: ['']
  }]);

  const [educations, setEducations] = useState<Education[]>([{
    school: '',
    degree: '',
    location: '',
    graduationYear: '',
    gpa: ''
  }]);

  const [certifications, setCertifications] = useState<Certification[]>([{
    title: '',
    year: '',
    organization: ''
  }]);

  const [skills, setSkills] = useState<Skills>({
    technical: '',
    languages: '',
    interests: ''
  });

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setExperiences(prev => [...prev, {
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bulletPoints: ['']
    }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean | string[]) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    ));
  };

  const updateBulletPoint = (expIndex: number, bulletIndex: number, value: string) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === expIndex 
        ? { ...exp, bulletPoints: exp.bulletPoints.map((bullet, j) => j === bulletIndex ? value : bullet) }
        : exp
    ));
  };

  const addBulletPoint = (expIndex: number) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === expIndex 
        ? { ...exp, bulletPoints: [...exp.bulletPoints, ''] }
        : exp
    ));
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === expIndex 
        ? { ...exp, bulletPoints: exp.bulletPoints.filter((_, j) => j !== bulletIndex) }
        : exp
    ));
  };

  const addEducation = () => {
    setEducations(prev => [...prev, {
      school: '',
      degree: '',
      location: '',
      graduationYear: '',
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

  const addCertification = () => {
    setCertifications(prev => [...prev, {
      title: '',
      year: '',
      organization: ''
    }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setCertifications(prev => prev.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    ));
  };

  const updateSkills = (field: keyof Skills, value: string) => {
    setSkills(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const downloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('resume-preview');
      
      if (!element) {
        console.error('Resume preview element not found');
        return;
      }

      const opt = {
        margin: 0.5,
        filename: `${personalInfo.firstName}_${personalInfo.lastName}_resume.pdf`.replace(/\s+/g, '_').toLowerCase(),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const downloadDOC = async () => {
    try {
      const { saveAs } = await import('file-saver');
      
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'Your Name';
      let docContent = `${fullName}\n`;
      
      // Contact info
      const contactInfo = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean);
      if (contactInfo.length > 0) {
        docContent += contactInfo.join(' | ') + '\n';
      }
      
      // Links
      const links = [];
      if (personalInfo.linkedin) links.push(`LinkedIn: ${personalInfo.linkedin}`);
      if (personalInfo.github) links.push(`GitHub: ${personalInfo.github}`);
      if (personalInfo.website) links.push(`Website: ${personalInfo.website}`);
      if (links.length > 0) {
        docContent += links.join(' | ') + '\n\n';
      }

      // Education
      const validEducations = educations.filter(edu => edu.school || edu.degree);
      if (validEducations.length > 0) {
        docContent += 'EDUCATION\n';
        validEducations.forEach(edu => {
          docContent += `${edu.degree || 'Degree'} | ${edu.school || 'School'} | ${edu.location || ''} | ${edu.graduationYear || ''}`;
          if (edu.gpa) docContent += ` | GPA: ${edu.gpa}`;
          docContent += '\n';
        });
        docContent += '\n';
      }

      // Experience
      const validExperiences = experiences.filter(exp => exp.jobTitle || exp.company);
      if (validExperiences.length > 0) {
        docContent += 'EXPERIENCE\n';
        validExperiences.forEach(exp => {
          docContent += `${exp.jobTitle || 'Job Title'} | ${exp.company || 'Company'} | ${exp.location || ''} | ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}\n`;
          exp.bulletPoints.filter(bullet => bullet.trim()).forEach(bullet => {
            docContent += `• ${bullet}\n`;
          });
          docContent += '\n';
        });
      }

      // Certifications
      const validCertifications = certifications.filter(cert => cert.title || cert.organization);
      if (validCertifications.length > 0) {
        docContent += 'CERTIFICATIONS & AWARDS\n';
        validCertifications.forEach(cert => {
          docContent += `${cert.title || 'Title'} | ${cert.organization || 'Organization'} | ${cert.year || ''}\n`;
        });
        docContent += '\n';
      }

      // Skills
      if (skills.technical || skills.languages || skills.interests) {
        docContent += 'SKILLS\n';
        if (skills.technical) docContent += `Technical: ${skills.technical}\n`;
        if (skills.languages) docContent += `Languages: ${skills.languages}\n`;
        if (skills.interests) docContent += `Interests: ${skills.interests}\n`;
      }

      const blob = new Blob([docContent], { type: 'application/msword' });
      const fileName = fullName.replace(/\s+/g, '_').toLowerCase();
      saveAs(blob, `${fileName}_resume.doc`);
    } catch (error) {
      console.error('Error generating DOC:', error);
      alert('Error generating DOC file. Please try again.');
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
            <div className="flex space-x-3">
              <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={downloadDOC} variant="outline">
                <FileDown className="w-4 h-4 mr-2" />
                Download DOC
              </Button>
            </div>
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
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={personalInfo.github}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    placeholder="github.com/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={personalInfo.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    placeholder="www.johndoe.com"
                  />
                </div>
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
                        <Label>School</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(index, 'school', e.target.value)}
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={edu.location}
                          onChange={(e) => updateEducation(index, 'location', e.target.value)}
                          placeholder="City, State"
                        />
                      </div>
                      <div>
                        <Label>Graduation Year</Label>
                        <Input
                          value={edu.graduationYear}
                          onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
                          placeholder="2024"
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(index, 'location', e.target.value)}
                          placeholder="City, State"
                        />
                      </div>
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
                      <Label>Key Achievements (Bullet Points)</Label>
                      {exp.bulletPoints.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex items-center space-x-2 mt-2">
                          <Input
                            value={bullet}
                            onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                            placeholder="• Describe your key achievement or responsibility..."
                            className="flex-1"
                          />
                          {exp.bulletPoints.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeBulletPoint(index, bulletIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addBulletPoint(index)}
                        className="mt-2 border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Bullet Point
                      </Button>
                    </div>
                    {experiences.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove Experience
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

            {/* Certifications & Awards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Certifications & Awards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={cert.title}
                          onChange={(e) => updateCertification(index, 'title', e.target.value)}
                          placeholder="AWS Certified Developer"
                        />
                      </div>
                      <div>
                        <Label>Organization</Label>
                        <Input
                          value={cert.organization}
                          onChange={(e) => updateCertification(index, 'organization', e.target.value)}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          value={cert.year}
                          onChange={(e) => updateCertification(index, 'year', e.target.value)}
                          placeholder="2024"
                        />
                      </div>
                    </div>
                    {certifications.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCertification(index)}
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
                  onClick={addCertification}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
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
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="technical">Technical Skills</Label>
                  <Textarea
                    id="technical"
                    value={skills.technical}
                    onChange={(e) => updateSkills('technical', e.target.value)}
                    placeholder="JavaScript, React, Node.js, Python, SQL, Git, AWS..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="languages">Languages</Label>
                  <Textarea
                    id="languages"
                    value={skills.languages}
                    onChange={(e) => updateSkills('languages', e.target.value)}
                    placeholder="English (Native), Spanish (Fluent), French (Conversational)..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <Textarea
                    id="interests"
                    value={skills.interests}
                    onChange={(e) => updateSkills('interests', e.target.value)}
                    placeholder="Photography, Hiking, Open Source Contributions..."
                    rows={2}
                  />
                </div>
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
                <div id="resume-preview" className="bg-white p-8 shadow-lg rounded-lg min-h-[800px] font-serif text-sm leading-relaxed">
                  {/* Header */}
                  <div className="text-center border-b-2 border-gray-800 pb-3 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {personalInfo.firstName || personalInfo.lastName 
                        ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim()
                        : 'Your Name'}
                    </h1>
                    <div className="text-gray-700 space-y-1">
                      {personalInfo.email && <div>{personalInfo.email}</div>}
                      <div className="flex justify-center space-x-4 text-sm">
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                      </div>
                      <div className="flex justify-center space-x-4 text-sm">
                        {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
                        {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
                        {personalInfo.website && <span>Website: {personalInfo.website}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  {educations.some(edu => edu.school || edu.degree) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3">
                        EDUCATION
                      </h2>
                      {educations.filter(edu => edu.school || edu.degree).map((edu, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold">{edu.degree || 'Degree'}</div>
                              <div className="italic">{edu.school || 'School'}</div>
                            </div>
                            <div className="text-right">
                              <div>{edu.location}</div>
                              <div>{edu.graduationYear}</div>
                              {edu.gpa && <div>GPA: {edu.gpa}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {experiences.some(exp => exp.jobTitle || exp.company) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3">
                        EXPERIENCE
                      </h2>
                      {experiences.filter(exp => exp.jobTitle || exp.company).map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-semibold">{exp.jobTitle || 'Job Title'}</div>
                              <div className="italic">{exp.company || 'Company'}</div>
                            </div>
                            <div className="text-right">
                              <div>{exp.location}</div>
                              <div>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                            </div>
                          </div>
                          {exp.bulletPoints.filter(bullet => bullet.trim()).length > 0 && (
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              {exp.bulletPoints.filter(bullet => bullet.trim()).map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="text-gray-800">{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {certifications.some(cert => cert.title || cert.organization) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3">
                        CERTIFICATIONS & AWARDS
                      </h2>
                      {certifications.filter(cert => cert.title || cert.organization).map((cert, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold">{cert.title || 'Title'}</div>
                              <div className="italic">{cert.organization || 'Organization'}</div>
                            </div>
                            <div>{cert.year}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {(skills.technical || skills.languages || skills.interests) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3">
                        SKILLS
                      </h2>
                      {skills.technical && (
                        <div className="mb-2">
                          <span className="font-semibold">Technical:</span> {skills.technical}
                        </div>
                      )}
                      {skills.languages && (
                        <div className="mb-2">
                          <span className="font-semibold">Languages:</span> {skills.languages}
                        </div>
                      )}
                      {skills.interests && (
                        <div className="mb-2">
                          <span className="font-semibold">Interests:</span> {skills.interests}
                        </div>
                      )}
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