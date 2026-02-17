import { useEffect, useState } from 'preact/hooks';

const Test = () => {
    const [lol, setLol] = useState(false)

    useEffect(() => {
        if (lol) {
            console.log('%c[Test]', 'color: #5606f5', `lol :`, lol)
        }
    }, [])

    return <img src="/logo.png" />
}

export default Test
