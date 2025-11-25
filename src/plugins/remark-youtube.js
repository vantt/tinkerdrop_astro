import { visit } from 'unist-util-visit';

const YOUTUBE_REGEX = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(?:\S+)?$/;

export function remarkYoutube() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (node.children.length !== 1) return;

      const child = node.children[0];
      let url = '';

      if (child.type === 'text') {
        url = child.value.trim();
      } else if (child.type === 'link') {
        url = child.url;
      } else {
        return;
      }

      const match = url.match(YOUTUBE_REGEX);
      if (match && match[1]) {
        const videoId = match[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        const iframeHtml = `
          <div class="w-full aspect-video rounded-lg overflow-hidden shadow-lg my-4">
            <iframe
              class="w-full h-full"
              src="${embedUrl}"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        `;

        parent.children[index] = {
          type: 'html',
          value: iframeHtml,
        };
      }
    });
  };
}
