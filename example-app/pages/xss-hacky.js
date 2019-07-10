import { useRouter } from 'next/router'

const XssHacky = ({route}) => {
  // try URL: http://localhost:3000/xss-hacky?html=<img src=x onerror="alert(1)">
  // React SSR seems to be ready for this and despite knowing the query on the server
  // will just render an empty paragraph. The inner html will be set on client
  // which will be rejected if we are using TT.
  return <p dangerouslySetInnerHTML={{__html: route}}/>
  // return <p>{router.query.html}</p>
}

XssHacky.getInitialProps = ({req}) => {
  const route = req.url.substr(req.url.indexOf('html=') + 5)
  // const router = useRouter();
  return {route: decodeURIComponent(route)}
}

export default XssHacky