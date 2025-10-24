import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BundleRoutes = () => {
    const { bundlePath } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // navigate(`/bundles/${bundlePath}/index.html`);
        window.location.assign(`${window.location.protocol}//${window.location.host}/bundles/${bundlePath}/index.html`);
    }, [bundlePath, navigate]);

    return <h3> Redirecting to {bundlePath}.... </h3>;
};

export default BundleRoutes;
