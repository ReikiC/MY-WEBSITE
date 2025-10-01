import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const personalInfo = {
  name: "陈单靠",
  nameEn: "Dankao Chen",
  title: "PhD Candidate in Electrical and Electronic Engineering",
  affiliation: "University of Nottingham Ningbo China",
  email: "dankaochen2002@gmail.com",
  github: "https://github.com/ReikiC",
  interests: [
    "Next-Generation Internet of Things",
    "Edge Computing",
    "Smart Home Systems",
    "Touch Fish"
  ]
};

const education = [
  {
    degree: "Ph.D. in Electrical and Electronic Engineering",
    institution: "University of Nottingham Ningbo China",
    period: "2026 - 2029 (Expected)",
    note: "Full Scholarship",
    supervisors: "Dr. Zheng Chu, Dr. David Chieng, Dr. Chiew-Foong Kwong"
  },
  {
    degree: "M.Sc. in Connected Environments",
    institution: "University College London",
    period: "2024 - 2025",
    note: "Merit Expected"
  },
  {
    degree: "B.Eng. (Hons) in Electrical and Electronic Engineering",
    institution: "University of Nottingham Ningbo China",
    period: "2020 - 2024",
    // note: "Upper Second-Class Honours (66%)"
  }
];

const experience = [
  {
    title: "Co-founder & CTO",
    organization: "Ningbo Rosy Nebula Information Technology Co., Ltd.",
    period: "2022 - Present",
    description: "Leading R&D in virtual production, 3D modeling, and AIGC technologies"
  },
  {
    title: "Research Assistant",
    organization: "University of Nottingham Ningbo China",
    period: "2023 - 2024",
    description: "RIS-assisted Mobile Edge Computing for NG-IoT networks"
  },
  {
    title: "Research Assistant",
    organization: "University College London",
    period: "2024 - 2025",
    description: "Connected environments and IoT sensor systems"
  }
];

const wikiStats = [
  { label: "Knowledge Articles", value: "100+", icon: "📄" },
  { label: "Categories", value: "7", icon: "📁" },
  { label: "Code Examples", value: "500+", icon: "💻" },
  { label: "Last Updated", value: "2025-01", icon: "📅" }
];

const wikiCategories = [
  {
    name: "数学基础",
    icon: "📐",
    path: "/docs/category/数学基础-1",
    description: "微积分、线性代数、概率统计"
  },
  {
    name: "计算机科学",
    icon: "💻",
    path: "/docs/category/计算机科学-1",
    description: "算法、数据结构、C/C++、嵌入式系统"
  },
  {
    name: "微电子学",
    icon: "🔬",
    path: "/docs/category/微电子学-1",
    description: "微电子器件、集成电路设计"
  },
  {
    name: "通信工程",
    icon: "📡",
    path: "/docs/category/通信工程-1",
    description: "通信原理、信号处理、网络协议"
  },
  {
    name: "工具和方法论",
    icon: "🛠️",
    path: "/docs/category/工具和方法论-1",
    description: "开发工具、项目管理、GitHub"
  },
  {
    name: "研究方法",
    icon: "🔍",
    path: "/docs/category/研究方法-1",
    description: "实验设计、学术写作、数据分析"
  },
  {
    name: "跨学科内容",
    icon: "🌐",
    path: "/docs/category/跨学科内容-1",
    description: "多领域交叉融合知识"
  }
];

function HeroSection() {
  const logoUrl = useBaseUrl('/img/logo.svg');
  const logoPngUrl = useBaseUrl('/img/logo.png');
  
  return (
    <header className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <div className={styles.avatarLarge}>
              <img 
                src={logoPngUrl} 
                alt="陈单靠的头像" 
                className={styles.avatarImage}
              />
            </div>
          </div>
          
          <div className={styles.heroRight}>
            <Heading as="h1" className={styles.mainTitle}>
              {personalInfo.name}
              <span className={styles.nameEn}>{personalInfo.nameEn}</span>
            </Heading>
            
            <p className={styles.subtitle}>{personalInfo.title}</p>
            <p className={styles.affiliation}>{personalInfo.affiliation}</p>
            
            <div className={styles.contactLinks}>
              <a href={`mailto:${personalInfo.email}`} className={styles.contactLink}>
                📧 Email
              </a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                🔗 GitHub
              </a>
              <Link to="/docs/knowledge" className={styles.contactLink}>
                📚 Knowledge Wiki
              </Link>
              <Link to="/blog" className={styles.contactLink}>
                ✍️ Blog
              </Link>
            </div>
            
            <div className={styles.interestTags}>
              {personalInfo.interests.map((interest, idx) => (
                <span key={idx} className={styles.tag}>{interest}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AboutSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <Heading as="h2" className={styles.sectionHeading}>About</Heading>
          <div className={styles.aboutContent}>
            <p>
              I am an incoming PhD candidate at the University of Nottingham Ningbo China, 
              working on Internet of Things and Edge Computing systems. My research focuses on 
              optimizing communications and computing in next-generation IoT networks, particularly 
              through Reconfigurable Intelligent Surfaces (RIS) and Mobile Edge Computing (MEC).
            </p>
            <p>
              This wiki serves as my personal knowledge repository, documenting technical knowledge, 
              research methodologies, and learning experiences across computer science, mathematics, 
              embedded systems, and engineering. It is built with Docusaurus and continuously updated 
              as I explore new topics and deepen my understanding of existing ones.
            </p>
            <p>
              Beyond academia, I co-founded Rosy Nebula Technology, where we explore the intersection 
              of virtual production, AIGC, and digital innovation. I believe in open knowledge sharing 
              and hope this wiki can benefit others on similar learning journeys.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WikiStatsSection() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <Heading as="h2" className={styles.sectionHeading}>Wiki Statistics</Heading>
          <div className={styles.statsGrid}>
            {wikiStats.map((stat, idx) => (
              <div key={idx} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WikiCategoriesSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <Heading as="h2" className={styles.sectionHeading}>Knowledge Categories</Heading>
          <div className={styles.categoryGrid}>
            {wikiCategories.map((category, idx) => (
              <Link 
                key={idx} 
                to={category.path} 
                className={styles.categoryCard}
              >
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
              </Link>
            ))}
          </div>
          <div className={styles.viewAllLink}>
            <Link to="/docs/knowledge" className={styles.primaryLink}>
              View All Knowledge Articles →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <Heading as="h2" className={styles.sectionHeading}>Education</Heading>
          <div className={styles.timelineList}>
            {education.map((edu, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelinePeriod}>{edu.period}</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{edu.degree}</h3>
                  <p className={styles.timelineOrg}>{edu.institution}</p>
                  {edu.note && <p className={styles.timelineNote}>{edu.note}</p>}
                  {edu.supervisors && (
                    <p className={styles.timelineSupervisors}>
                      Supervisors: {edu.supervisors}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <Heading as="h2" className={styles.sectionHeading}>Experience</Heading>
          <div className={styles.timelineList}>
            {experience.map((exp, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelinePeriod}>{exp.period}</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{exp.title}</h3>
                  <p className={styles.timelineOrg}>{exp.organization}</p>
                  <p className={styles.timelineDescription}>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContributingSection() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <Heading as="h2" className={styles.sectionHeading}>Using This Wiki</Heading>
          <div className={styles.aboutContent}>
            <p>
              This wiki is organized as a structured knowledge base covering multiple disciplines. 
              Each article includes detailed explanations, code examples, and practical applications.
            </p>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>📖</span>
                <div>
                  <h4>Comprehensive Documentation</h4>
                  <p>In-depth coverage of computer science fundamentals, from algorithms to system design</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>💻</span>
                <div>
                  <h4>Code Examples</h4>
                  <p>Practical code snippets and implementations in C/C++, Python, and JavaScript</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🔄</span>
                <div>
                  <h4>Continuously Updated</h4>
                  <p>Regular updates with new topics, corrections, and expanded content</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🌐</span>
                <div>
                  <h4>Open Access</h4>
                  <p>All content is freely accessible. Source code available on GitHub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Personal academic homepage and knowledge wiki of Dankao Chen - PhD candidate researching IoT and Edge Computing">
      <HeroSection />
      <main>
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <WikiStatsSection />
        <WikiCategoriesSection />
        <ContributingSection />
      </main>
    </Layout>
  );
}