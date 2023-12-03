import MarkdownIt from 'markdown-it';

export const renderer = new MarkdownIt('default', {
  html: false,
  typographer: true,
  breaks: true,
  linkify: true,
});

export const renderMd = (input: string): string => {
  return renderer.render(input);
};
