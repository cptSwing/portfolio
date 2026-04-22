import { useEffect } from 'preact/hooks';

// NOTE not sure preact is needed here AT ALL
// TODO Or is it needed to work with a loading fallback component? at least if full content is fetched as opposed to just the modified date?

const PostUpdater = ({ postId, initialModified }: { postId: string; initialModified: string }) => {
    useEffect(() => {
        let cancelled = false;
        async function fetchLatest() {
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
            if (cancelled) return;

            const latest = data.data.post;

            // skip if unchanged
            if (latest.modified === initialModified) return;

            const root = document.querySelector('#post');
            if (!root) return;

            // targeted updates
            const map = {
                title: (el, v) => (el.textContent = v),
                content: (el, v) => (el.innerHTML = v),
                modified: (el, v) => (el.textContent = v),
            };

            Object.entries(map).forEach(([field, apply]) => {
                const el = root.querySelector(`[data-field="${field}"]`);
                if (el) apply(el, latest[field]);
            });
        }

        fetchLatest();

        // optional: re-check every minute
        // const id = setInterval(fetchLatest, 60000);
        // return () => { cancelled = true; clearInterval(id); };

        return () => {
            cancelled = true;
        };
    }, [postId, initialModified]);

    return null; // invisible
};

export default PostUpdater;
