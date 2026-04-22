export async function updatePost(root) {
    const postId = root.dataset.postId;

    // TODO replace with own gql client?
    // TODO first fetch only modified data?
    const res = await fetch('https://your-wp-site.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query GetPost($id: ID!) {
          post(id: $id) {
            title
            content
            modified
          }
        }
      `,
            variables: { id: postId },
        }),
    });

    const data = await res.json();
    const latest = data.data.post;

    const currentModified = root.querySelector('[data-field="modified"]')?.textContent;

    if (latest.modified === currentModified) return;
    // TODO else fetch with different query

    // 1. show loading state
    root.classList.add('is-loading');

    try {
        const map = {
            title: (el, v) => (el.textContent = v),
            content: (el, v) => (el.innerHTML = v),
            modified: (el, v) => (el.textContent = v),
        };

        Object.entries(map).forEach(([field, apply]) => {
            const el = root.querySelector(`[data-field="${field}"]`);
            if (el) apply(el, latest[field]);
        });
    } finally {
        root.classList.remove('is-loading');
    }
}
