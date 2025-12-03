import { useParams } from 'react-router-dom';

const BundleRoutes = () => {
    const { bundlePath } = useParams();
    bundlePath && window.location.assign(`${window.location.protocol}//${window.location.host}/bundles/${bundlePath.toLowerCase()}/index.html`);
    return <h3> Redirecting to {bundlePath}.... </h3>;
};

export default BundleRoutes;
