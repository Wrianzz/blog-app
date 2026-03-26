import { motion } from 'motion/react';
import { ArrowRight, Briefcase, GraduationCap, Award, Code, FileBadge } from 'lucide-react';
import { Link } from 'react-router-dom';

const experiences = [
  {
    role: 'DevSecOps Engineer Intern',
    company: 'PT Sat Nusapersada Tbk',
    period: '2025 — Present',
    description: 'Architecting robust DevSecOps ecosystems by integrating automated security testing and vulnerability management into scalable CI/CD pipelines. Leading the design of high-availability infrastructure and modular automation workflows to ensure system resilience and operational efficiency.',
    achievements: [
      'Built vulnerability management workflows with automated prioritization and remediation tracking.',
      'Integrated and tuned DAST into CI/CD pipelines with authenticated scans.',
      'Modularized CI/CD pipelines using shared libraries to improve CI/CD scalability and reuse.',
      'Designed and implemented multiple automation workflows applied across company applications.',
      'Designed a self-hosted cloud storage and collaboration platform for company environments.',
      'Researched and developed High-Availability (HA) architectures to ensure fault tolerance, automated failover, and minimal service downtime.',
    ]
  }
];

const education = [
  {
    degree: 'BASc. in Cyber Security Engineering',
    institution: 'Politeknik Negeri Batam',
    period: '2022 — Present',
    description: 'Undergraduate. Specialized in Blue Team, Networking, and DevSecOps.'
  }
];

const certifications = [
  {
    name: 'Red Hat Certified System Administrator',
    issuer: 'Red Hat',
    year: '2024 - 2027'
  },
  {
    name: 'Junior Network Administrator',
    issuer: 'BNSP',
    year: '2023 - 2026'
  },
  {
    name: 'Junior Web Developer',
    issuer: 'BNSP',
    year: '2024 - 2027'
  }
];

const achievements = [
  {
    title: 'First Place, Sysadmin Heroes Competition organized by Infinite Learning',
    year: '2024',
    description: 'System Administration competition to test participants skills in configuring and troubleshooting the operating system (CentOS) used.'
  },
  {
    title: 'Silver Certificate, Cisco APJC NetAcad Riders',
    year: '2024',
    description: 'APJC NetAcad Rider event is one of the prestigious competitions in the field of computer networking, participated by university students and vocational high school students at the international level.'
  }
];

const skills = [
  'DevOps/DevSecOps', 'Cyber Security', 'CI/CD', 'Automation', 'High-Availability', 'Vulnerability Management',  
  'SDLC', 'Linux Sysadmin', 'Networking'
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="space-y-8 pt-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight max-w-3xl">
          Fathur Wiriansyah
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
          DevOps Engineer & Security Engineer. I specialize in architecting scalable infrastructure and implementing DevSecOps practices to safeguard high-performance digital environments.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center h-12 px-8 font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
          >
            Contact Me
          </Link>
          <a
            href="#"
            className="inline-flex items-center justify-center h-12 px-8 font-medium text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            Download PDF Resume
          </a>
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Code className="w-5 h-5 text-gray-400" />
          <h2 className="text-2xl font-semibold tracking-tight">Technical Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Briefcase className="w-5 h-5 text-gray-400" />
          <h2 className="text-2xl font-semibold tracking-tight">Work Experience</h2>
        </div>
        
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              {/* Timeline line for mobile */}
              <div className="md:hidden absolute left-0 top-2 bottom-0 w-px bg-gray-200" />
              <div className="md:hidden absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-black" />

              <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="md:col-span-3 text-sm font-mono text-gray-500 mt-1">
                  {exp.period}
                </div>
                <div className="md:col-span-9 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black">{exp.role}</h3>
                    <div className="text-gray-600 font-medium">{exp.company}</div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {exp.description}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="leading-relaxed">{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <GraduationCap className="w-5 h-5 text-gray-400" />
          <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
        </div>
        
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={index} className="grid md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-3 text-sm font-mono text-gray-500 mt-1">
                {edu.period}
              </div>
              <div className="md:col-span-9 space-y-2">
                <h3 className="text-xl font-semibold text-black">{edu.degree}</h3>
                <div className="text-gray-600 font-medium">{edu.institution}</div>
                <p className="text-gray-600 leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications & Achievements */}
      <div className="grid md:grid-cols-2 gap-16">
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <FileBadge className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-semibold tracking-tight">Certifications</h2>
          </div>
          <div className="space-y-6">
            {certifications.map((cert, index) => (
              <div key={index} className="space-y-1">
                <h3 className="font-semibold text-black">{cert.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{cert.issuer}</span>
                  <span className="font-mono text-gray-400">{cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <Award className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-semibold tracking-tight">Achievements</h2>
          </div>
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-black leading-tight">{achievement.title}</h3>
                  <span className="font-mono text-sm text-gray-400 shrink-0">{achievement.year}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <section className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Let's Connect</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Feel free to reach out if you're looking for partner to join your team, have a question, or just want to connect.
        </p>
        <div className="pt-4">
          <Link to="/contact" className="inline-flex items-center text-black font-medium hover:underline decoration-1 underline-offset-4">
            Get in touch <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
