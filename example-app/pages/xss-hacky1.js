const Hacky1 = (props) => {
  // try URL: http://localhost:3000/xss-hacky?html=<img src=x onerror="alert(1)">
  return <p dangerouslySetInnerHTML={{__html: props.url.query.html}}/>
}

Hacky1.getInitialProps = () => ({})

export default Hacky1