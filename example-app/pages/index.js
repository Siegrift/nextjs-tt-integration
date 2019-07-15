import React from 'react'
// Link formats the url before passing it to <a> and it returns '' when url is object (TT)
// import Link from 'next/link'
import Head from '../components/head'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import {getPolicy, togglePolicy} from '../trustedTypesPolicy'

const DynamicScript = dynamic(() => import('./script'), { ssr: false });

class Home extends React.Component {
  state = {
    hrefText: '',
    href: '',
    html: '',
    nodes: [],
    iframe: false,
  }

  render() {
    return (
      <div>
        <Head title="Home" />

        <div>
          {/* Router.push is using TT so you can safely change routes. */}
          <button onClick={() => Router.push('/about')}>About route</button>

          {/* This will trigger an error and nextjs will try to load it's default (trusted) error page. */}
          <button onClick={() => Router.push('/nonExistent')}>Non-existent route</button>
        </div>
        
        {/* Trigger xss */}
        <div>
          <a href={getPolicy().createURL('/xss-hacky1?html=<img%20src=%27x%27%20onerror="alert(1)"')}>
            <button>Xss 1</button>
          </a>
          <a href={getPolicy().createURL('/xss-hacky2?html=<img%20src=%27x%27%20onerror="alert(1)"')}>
            <button>Xss 2</button>
          </a>
          <a href={getPolicy().createURL('/xss-hacky3?html=<img%20src=%27x%27%20onerror="alert(1)"')}>
            <button>Xss 3</button>
          </a>
          <a href={getPolicy().createURL('/xss-hacky4?html=<img%20src=%27x%27%20onerror="alert(1)"')}>
            <button>Xss 4</button>
          </a>
        </div>

        <div>
          <button onClick={() => Router.push('/script')}>Render script</button>
        </div>

        {/* This will cause an violation of TT (on client) if href is not trusted. */}
        <p>
          <a href={getPolicy().createURL(this.state.href)}>Link with custom href</a>
          {/* Try: javascript:alert(0) */}
          <input 
            type="text"
            value={this.state.hrefText}
            onChange={(e) => this.setState({hrefText: e.target.value})}
          />
          <button onClick={() => this.setState((s) => ({href: s.hrefText}))}>Set href</button>
        </p>

        {/* Will try to add html dangerously dynamically. */}
        <p>
          Add node with dangerouslySetInnerHTML
          {/* Try: <img src=x onerror=alert(0) /> */}
          <input 
            type="text"
            value={this.state.html}
            onChange={(e) => this.setState({html: e.target.value})}
          />
          <button
            onClick={() => this.setState((s) => ({nodes: [...s.nodes, s.html]}))}
          >
            Add node
          </button>
          {this.state.nodes.map((n, i) => (
            // created html (TT) will be created on every render and as TT is an object, it will
            // be treated as a change and will rerender the component.
            // See TT_TODO in react-dom/src/client/ReactDOMComponent.js
            <span key={i} dangerouslySetInnerHTML={{__html: getPolicy().createHTML(n)}} />
            ))}
        </p>
        
        {/* React can't execute dynamic scripts: react-dom/src/client/ReactDOMComponent.js */}
        <DynamicScript />

        {/* Will try to add iframe with srcdoc. */}
        <p>
          <button
            onClick={() => this.setState({iframe: true})}
          >
            Add unsecure iframe
          </button>
          {this.state.iframe && <iframe srcDoc={getPolicy().createHTML("<script>alert(0)</script>")}></iframe>}
        </p>
      </div>
    )
  }
}

export default Home
