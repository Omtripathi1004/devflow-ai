import { RepositoryFile, ProjectAspectProgress } from '../types';

export interface FolderAnalysisResult {
  projectName: string;
  filesTree: RepositoryFile[];
  totalFiles: number;
  totalLines: number;
  languages: Record<string, number>;
  frameworks: string[];
  aspectScores: {
    frontend: number;
    backend: number;
    database: number;
    deployment: number;
    security: number;
  };
}

export class ProjectFolderService {
  /**
   * Builds a nested RepositoryFile tree from a FileList with webkitRelativePath
   */
  public static async parseFileList(fileList: FileList | File[]): Promise<FolderAnalysisResult> {
    const files = Array.from(fileList);
    if (files.length === 0) {
      throw new Error('No files selected');
    }

    const firstRelative = files[0].webkitRelativePath || files[0].name;
    const projectName = firstRelative.includes('/') ? firstRelative.split('/')[0] : 'Uploaded Project';

    const rootNodes: Record<string, any> = {};
    let totalLines = 0;
    const languages: Record<string, number> = {};

    let hasFrontend = false;
    let hasBackend = false;
    let hasDatabase = false;
    let hasDeployment = false;
    let hasTests = false;

    // Process each file
    for (const file of files) {
      const relPath = file.webkitRelativePath || file.name;
      // Strip top root folder name if present
      const cleanPath = relPath.startsWith(`${projectName}/`)
        ? relPath.slice(projectName.length + 1)
        : relPath;

      if (!cleanPath || cleanPath.startsWith('.git/') || cleanPath.includes('/node_modules/')) {
        continue;
      }

      const parts = cleanPath.split('/');
      const fileName = parts[parts.length - 1];
      const ext = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() || '' : '';

      // Count languages
      if (ext) {
        languages[ext] = (languages[ext] || 0) + 1;
      }

      // Aspect detection
      const lower = cleanPath.toLowerCase();
      if (['tsx', 'jsx', 'html', 'css', 'vue', 'svelte'].includes(ext) || lower.includes('components') || lower.includes('views') || lower.includes('pages')) {
        hasFrontend = true;
      }
      if (['ts', 'js', 'py', 'go', 'java', 'rs', 'php', 'rb'].includes(ext) || lower.includes('services') || lower.includes('routes') || lower.includes('controllers') || lower.includes('api')) {
        hasBackend = true;
      }
      if (['sql', 'prisma'].includes(ext) || lower.includes('schema') || lower.includes('models') || lower.includes('migrations') || lower.includes('db')) {
        hasDatabase = true;
      }
      if (lower.includes('docker') || lower.includes('vercel') || lower.includes('.github') || lower.includes('k8s') || lower.includes('helm') || lower.includes('terraform')) {
        hasDeployment = true;
      }
      if (lower.includes('test') || lower.includes('spec') || lower.includes('__tests__')) {
        hasTests = true;
      }

      // Read small text files
      let content = '';
      if (file.size < 500000 && !['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'pdf', 'zip', 'tar', 'gz', 'exe', 'bin'].includes(ext)) {
        try {
          content = await file.text();
          const lines = content.split('\n').length;
          totalLines += lines;
        } catch {
          content = `// Content preview unavailable for ${fileName}`;
        }
      }

      // Insert into tree
      let currentLevel = rootNodes;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;

        if (isFile) {
          currentLevel[part] = {
            name: part,
            path: cleanPath,
            type: 'file',
            language: ext,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            content: content || `// File: ${cleanPath}`,
            status: 'normal',
          };
        } else {
          if (!currentLevel[part]) {
            currentLevel[part] = {
              name: part,
              path: parts.slice(0, i + 1).join('/'),
              type: 'dir',
              children: {},
            };
          }
          currentLevel = currentLevel[part].children;
        }
      }
    }

    // Convert object hierarchy to RepositoryFile[]
    const convertNode = (node: any): RepositoryFile => {
      if (node.type === 'file') {
        return {
          name: node.name,
          path: node.path,
          type: 'file',
          language: node.language,
          size: node.size,
          content: node.content,
          status: node.status,
        };
      }
      const childrenKeys = Object.keys(node.children || {});
      const children: RepositoryFile[] = childrenKeys.map((k) => convertNode(node.children[k]));
      // Sort dirs first, then files
      children.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
      });

      return {
        name: node.name,
        path: node.path,
        type: 'dir',
        children,
      };
    };

    const finalTree: RepositoryFile[] = Object.keys(rootNodes).map((k) => convertNode(rootNodes[k]));
    finalTree.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'dir' ? -1 : 1;
    });

    const frameworks: string[] = [];
    if (languages['tsx'] || languages['jsx']) frameworks.push('React');
    if (languages['py']) frameworks.push('Python');
    if (languages['ts']) frameworks.push('TypeScript');
    if (languages['go']) frameworks.push('Go');
    if (languages['java']) frameworks.push('Java');
    if (hasDeployment) frameworks.push('Docker / CI');

    return {
      projectName,
      filesTree: finalTree,
      totalFiles: files.length,
      totalLines,
      languages,
      frameworks,
      aspectScores: {
        frontend: hasFrontend ? 92 : 30,
        backend: hasBackend ? 95 : 40,
        database: hasDatabase ? 88 : 25,
        deployment: hasDeployment ? 90 : 35,
        security: hasTests ? 94 : 50,
      },
    };
  }
}
