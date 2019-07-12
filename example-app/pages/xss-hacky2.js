const XssHacky2 = (props) => {
  const query = props.url.asPath
  // try URL: http://localhost:3000/xss-hacky2?html=<img src=x onerror="alert(1)">
  // unsafe route will be passed as props
  return <p dangerouslySetInnerHTML={{__html: decodeURIComponent(query.substr(query.indexOf('html=') + 5))}}/>
}

export default XssHacky2