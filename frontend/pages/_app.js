import '../styles/globals.css'
import { useAuth } from '../utils/auth'
import Head from 'next/head';
import AuroraBackground from '../components/common/AuroraBackground';

export default function App({ Component, pageProps }) {
  const auth = useAuth()

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Head>
        <title>Bibliotech • Crônicas, Sagas & Clube Literário</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cinzel+Decorative:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=MedievalSharp&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AuroraBackground />
      <Component {...pageProps} auth={auth} />
    </div>
  )
}

