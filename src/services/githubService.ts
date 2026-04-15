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

export interface PostMedia {
  name: string;
  download_url: string;
  type: 'image' | 'video' | 'audio';
}

export interface Post {
  id: string;
  folderName: string;
  media: PostMedia[];
  bgMusic?: string;
  caption: string;
  date: number;
}

export async function fetchMediaFiles(): Promise<Post[]> {
  const repo = 'pandudwiyan/satusatunyakesayanganaiy';
  const path = 'media';
  const contentsUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const contentsResponse = await fetch(contentsUrl);
    if (!contentsResponse.ok) {
      throw new Error(`Failed to fetch media contents: ${contentsResponse.statusText}`);
    }
    const items: any[] = await contentsResponse.json();
    const folders = items.filter(item => item.type === 'dir');

    const posts = await Promise.all(folders.map(async (folder) => {
      // Fetch contents of each folder
      const folderContentsUrl = folder.url;
      const folderContentsResponse = await fetch(folderContentsUrl);
      const folderItems: any[] = await folderContentsResponse.json();

      let bgMusic: string | undefined;
      let caption = folder.name; // Default to folder name
      const media: PostMedia[] = [];

      // Get folder date from commits
      const folderCommitsUrl = `https://api.github.com/repos/${repo}/commits?path=${folder.path}&per_page=1`;
      let date = 0;
      try {
        const dateRes = await fetch(folderCommitsUrl);
        if (dateRes.ok) {
          const commits = await dateRes.json();
          if (commits.length > 0) {
            date = new Date(commits[0].commit.committer.date).getTime();
          }
        }
      } catch (e) {
        console.error(`Error fetching date for folder ${folder.name}:`, e);
      }

      for (const item of folderItems) {
        if (item.type !== 'file') continue;

        if (item.name === 'bg.mp3') {
          bgMusic = item.download_url;
        } else if (item.name === 'caption.txt') {
          try {
            const captionRes = await fetch(item.download_url);
            if (captionRes.ok) {
              caption = await captionRes.text();
            }
          } catch (e) {
            console.error(`Error fetching caption for ${folder.name}:`, e);
          }
        } else {
          const ext = item.name.split('.').pop()?.toLowerCase();
          let type: 'image' | 'video' | 'audio' = 'image';
          if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) type = 'video';
          else if (['mp3', 'wav', 'm4a', 'aac'].includes(ext || '')) type = 'audio';
          
          if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'ogg', 'mov', 'mp3', 'wav', 'm4a', 'aac'].includes(ext || '')) {
            media.push({
              name: item.name,
              download_url: item.download_url,
              type
            });
          }
        }
      }

      // Sort media by filename (e.g., 1.jpg, 2.jpg)
      media.sort((a, b) => {
        const aNum = parseInt(a.name.split('.')[0]);
        const bNum = parseInt(b.name.split('.')[0]);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        return a.name.localeCompare(b.name);
      });

      return {
        id: folder.sha,
        folderName: folder.name,
        media,
        bgMusic,
        caption,
        date
      };
    }));

    // Sort posts by date descending (newest first)
    return posts.sort((a, b) => b.date - a.date);

  } catch (error) {
    console.error('Error fetching media from GitHub:', error);
    return [];
  }
}
