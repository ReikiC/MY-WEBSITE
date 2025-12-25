import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

interface FriendLink {
  title: string;
  description: string;
  website: string;
  avatar?: string;
}

const friendLinks: FriendLink[] = [
    {
    title: 'Docusaurus',
    description: '快速构建以内容为核心的最佳网站',
    website: 'https://docusaurus.io/',
    avatar: 'https://docusaurus.io/img/docusaurus.png',
    },
    {
    title: 'React',
    description: '用于构建用户界面的 JavaScript 库',
    website: 'https://react.dev/',
    avatar: 'https://react.dev/favicon.ico',
    },
    {
    title: 'GitHub',
    description: '全球最大的代码托管平台',
    website: 'https://github.com',
    avatar: 'https://github.githubassets.com/favicons/favicon.png',
    },
    // 添加更多友链...
    {
      title:'Dankao Wiki',
      description:'Dankao的个人知识库',
      website:'https://reikic.github.io/MY-WEBSITE/',
      avatar:'https://reikic.github.io/MY-WEBSITE/img/logo.png'
    },
    {
      title: '云翰虹章',
      description: '我的公司官网',
      website: 'https://rn-website-beta.vercel.app/',
      avatar: 'https://reikic.github.io/MY-WEBSITE/img/RN-Logo.jpg'
    },
    {
    title: 'HNRobert\'s Space',
    description: 'HNRobert\'s Space',
    website: 'https://hnrobert.space',
    avatar: 'https://hnrobert.space/assets/favicon.ico'
    },
    {
    title: '冯宁辉的赛博史记',
    description: '冯半仙的个人日志博客',
    website: 'https://feng1201.github.io/my_blog',
    avatar: 'https://reikic.github.io/MY-WEBSITE/img/NinghuiFeng.jpg'
    },
];

function FriendCard({ title, description, website, avatar }: FriendLink) {
  return (
    <div className={styles.friendCard}>
      <a href={website} target="_blank" rel="noopener noreferrer" className={styles.friendCardLink}>
        <div className={styles.friendCardInner}>
          <div className={styles.friendCardHeader}>
            {avatar && (
              <img 
                src={avatar} 
                alt={title} 
                className={styles.friendAvatar}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className={styles.friendCardTitle}>
              <h3>{title}</h3>
              <svg 
                className={styles.externalLinkIcon}
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="currentColor"
              >
                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </div>
          </div>
          <p className={styles.friendCardDescription}>{description}</p>
        </div>
      </a>
    </div>
  );
}

export default function FriendLinks() {
  return (
    <Layout
      title="友情链接"
      description="我的友情链接页面 - Friend Links">
      <main className={styles.friendLinksPage}>
        <div className={styles.friendLinksContainer}>
          <div className={styles.friendLinksHeader}>
            <Heading as="h1" className={styles.friendLinksTitle}>
              友情链接
            </Heading>
            <p className={styles.friendLinksSubtitle}>
              这里收录了一些优秀的网站和博客，欢迎互相交流学习 🤝
            </p>
          </div>

          <div className={styles.friendLinksGrid}>
            {friendLinks.map((link, idx) => (
              <FriendCard key={idx} {...link} />
            ))}
          </div>

          <div className={styles.applySection}>
            <Heading as="h2" className={styles.applySectionTitle}>
              申请友链
            </Heading>
            <div className={styles.applySectionContent}>
              <p>如果你也想添加友链，欢迎通过以下方式联系我：</p>
              <ul>
                <li>📧 Email: <a href="mailto:dankaochen2002@gmail.com">dankaochen2002@gmail.com</a></li>
                <li>🐱 GitHub: <a href="https://github.com/ReikiC" target="_blank" rel="noopener noreferrer">@ReikiC</a></li>
              </ul>
              <div className={styles.applySectionNote}>
                <p><strong>友链格式：</strong></p>
                <pre className={styles.codeBlock}>
{`{
  title: '网站名称',
  description: '网站描述',
  website: 'https://your-website.com',
  avatar: 'https://your-website.com/avatar.png'
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}