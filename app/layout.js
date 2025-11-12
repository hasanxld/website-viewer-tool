export const metadata = {
  title: 'Advanced Website Viewer Tool',
  description: 'Super fast website viewer with proxy support and unlimited views',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-space-grotesk antialiased">
        {children}
      </body>
    </html>
  )
}
