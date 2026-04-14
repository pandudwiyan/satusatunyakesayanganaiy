/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

export async function fetchMediaFiles(): Promise<GitHubFile[]> {
  const repo = 'pandudwiyan/satusatunyakesayanganaiy';
  const path = 'media';
  const contentsUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const commitsUrl = `https://api.github.com/repos/${repo}/commits?path=${path}`;

  try {
    // 1. Fetch file contents
    const contentsResponse = await fetch(contentsUrl);
    if (!contentsResponse.ok) {
      throw new Error(`Failed to fetch media contents: ${contentsResponse.statusText}`);
    }
    const files: GitHubFile[] = await contentsResponse.json();
    const mediaFiles = files.filter(file => file.type === 'file');

    // 2. Fetch commits to get the last modified date for each file
    // Note: This is an approximation since we can't easily get creation date for all files in one call.
    // However, we can fetch the commits for the directory to see the order of changes.
    const commitsResponse = await fetch(commitsUrl);
    if (!commitsResponse.ok) {
      // Fallback to alphabetical reverse if commits fetch fails
      return mediaFiles.reverse();
    }
    const commits = await commitsResponse.json();

    // Create a map of filename to its latest commit date
    // We'll fetch individual file commits for better accuracy if needed, 
    // but for a small repo, we can often infer from the directory commits.
    // Let's try to get the actual last commit date for each file for precise sorting.
    
    const filesWithDates = await Promise.all(mediaFiles.map(async (file) => {
      const fileCommitsUrl = `https://api.github.com/repos/${repo}/commits?path=${file.path}&per_page=1`;
      try {
        const res = await fetch(fileCommitsUrl);
        if (res.ok) {
          const fileCommits = await res.json();
          if (fileCommits.length > 0) {
            return { ...file, date: new Date(fileCommits[0].commit.committer.date).getTime() };
          }
        }
      } catch (e) {
        console.error(`Error fetching date for ${file.name}:`, e);
      }
      return { ...file, date: 0 };
    }));

    // Sort by date descending (newest first)
    return filesWithDates
      .sort((a, b) => b.date - a.date);

  } catch (error) {
    console.error('Error fetching media from GitHub:', error);
    return [];
  }
}
