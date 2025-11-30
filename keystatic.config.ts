import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*/index',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        pubDate: fields.date({ label: 'Publication Date' }),
        updatedDate: fields.date({ label: 'Updated Date' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/blog-images',
          publicPath: '/blog-images/',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Học', value: 'Học' },
            { label: 'Làm', value: 'Làm' },
            { label: 'Chơi', value: 'Chơi' },
            { label: 'Khác', value: 'Khác' },
          ],
          defaultValue: 'Khác',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        published: fields.checkbox({ label: 'Published', defaultValue: false }),
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: 'public/blog-images',
              publicPath: '/blog-images/',
            },
          },
        }),
      },
    }),
  },
});
