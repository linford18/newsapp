/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">News Headlines</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-newsfeed">
            <a className="mr-6 text-pink-500">
              Create Article
            </a>
          </Link>
          <Link href="/my-articles">
            <a className="mr-6 text-pink-500">
              My Articles
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-pink-500">
              Dashboard
            </a>
          </Link>
          
          <Link href="/alchemy-nft">
            <a className="mr-6 text-pink-500">
              Alchemy -Articles
            </a>
          </Link>
          <Link href="/video-upload">
            <a className="mr-6 text-pink-500">
              Livepeer -Upload
            </a>
          </Link>
          <Link href="/video-view">
            <a className="mr-6 text-pink-500">
              Livepeer - View
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp