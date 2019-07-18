import {getPolicy} from '../trustedTypesPolicy'

const Script = () => {
  {/* This is rendered differently on server and on client. */}
  return <script dangerouslySetInnerHTML={{__html: getPolicy().createHTML("alert('Not gonna happen bro!')")}}/>
  return <div></div>
}

export default Script