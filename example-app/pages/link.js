import {getPolicy} from '../trustedTypesPolicy'

const LinkPage = () => {
  return (
    <a href={getPolicy().createURL("https://github.com/zeit/next.js#getting-started")}>
      <p>Link with constant value</p>
    </a>
  )
}

export default LinkPage