import { useRouter } from 'next/router'

const Hacky = () => {
  const router = useRouter();
  // try URL: http://localhost:3000/hacky?html=<img src=x onerror="alert(1)">
  // React SSR seems to be ready for this and despite knowing the query on the server
  // will just render an empty paragraph. The inner html will be set on client
  // which will be rejected if we are using TT.
  return <p dangerouslySetInnerHTML={{__html: router.query.html}}/>
}

export default Hacky