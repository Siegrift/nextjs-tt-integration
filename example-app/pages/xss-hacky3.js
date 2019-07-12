const XssHacky3 = (props) => {
  // try URL: http://localhost:3000/xss-hacky?html=<img src=x onerror="alert(1)">
  // unsafe route will be passed as parameter from getInitialProps
  return <p dangerouslySetInnerHTML={{__html: props.route}}/>
}

XssHacky3.getInitialProps = ({req}) => {
  const route = req.url.substr(req.url.indexOf('html=') + 5)
  // const router = useRouter();
  return {route: decodeURIComponent(route)}
}

export default XssHacky3