import '../styles/globals.css'
import { useAuth } from '../utils/auth'
import Head from 'next/head'; // Importa o Head
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const auth = useAuth()

  // Configurar interceptors do axios uma vez

  return (
    <div>
      <Head>
        <title>Modelo Base • Fullstack</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} auth={auth} />
    </div>
  )
}

