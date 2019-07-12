import { useRouter } from 'next/router'

const Hacky4 = (props) => {
  // try URL: http://localhost:3000/xss-hacky4?html=<img src=x onerror="alert(1)">
  const query = useRouter().asPath
  return <p dangerouslySetInnerHTML={{__html: decodeURIComponent(query.substr(query.indexOf('html=') + 5))}}/>
}

export default Hacky4