import React from 'react'
// Link formats the url before passing it to <a> and it returns '' when url is object (TT)
// import Link from 'next/link'
import Head from '../components/head'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import {getPolicy} from '../trustedTypesPolicy'

const DynamicScript = dynamic(() => import('./script'), { ssr: false });

class Home extends React.Component {
  state = {
    hrefText: '',
    href: '',
    untrustedHrefText: '',
    untrustedHref: '',
    html: '',
    nodes: [],
    untrustedHtml: '',
    untrustedNodes: [],
    iframe: false,
  }

  render() {
    return (
      <div>
        <Head title="Home" />

        <div dangerouslySetInnerHTML={{__html: getPolicy().createHTML('<script>console.log("GAME OVER WITH SSR");</script>')}}></div>

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

        {/* Try: javascript:alert(0) */}
        <p>
          {this.state.href && <a href={getPolicy().createURL(this.state.href)}>Link with trusted href</a>}
          <input
            type="text"
            value={this.state.hrefText}
            onChange={(e) => this.setState({hrefText: e.target.value})}
          />
          <button onClick={() => this.setState((s) => ({href: s.hrefText}))}>Set href</button>
        </p>
        <p>
          {this.state.untrustedHref && <a href={this.state.untrustedHref}>Link with NON trusted href</a>}
          <input
            type="text"
            value={this.state.untrustedHrefText}
            onChange={(e) => this.setState({untrustedHrefText: e.target.value})}
          />
          <button onClick={() => this.setState((s) => ({untrustedHref: s.untrustedHrefText}))}>Set untrusted href</button>
        </p>

        {/* Try: <img src=x onerror=alert(0) /> */}
        <p>
          Add node with dangerouslySetInnerHTML
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
        <p>
          Add node with NON trusted dangerouslySetInnerHTML
          <input
            type="text"
            value={this.state.untrustedHtml}
            onChange={(e) => this.setState({untrustedHtml: e.target.value})}
          />
          <button
            onClick={() => this.setState((s) => ({untrustedNodes: [...s.untrustedNodes, s.untrustedHtml]}))}
          >
            Add NON trusted node
          </button>
          {this.state.untrustedNodes.map((n, i) => (
            // created html (TT) will be created on every render and as TT is an object, it will
            // be treated as a change and will rerender the component.
            // See TT_TODO in react-dom/src/client/ReactDOMComponent.js
            <span key={i} dangerouslySetInnerHTML={{__html: n}} />
            ))}
        </p>

        {/* React can't execute dynamic scripts: react-dom/src/client/ReactDOMComponent.js */}
        {/* <DynamicScript /> */}

        {/* Will try to add iframe with srcdoc. */}
        <p>
          <button
            onClick={() => this.setState({iframe: true})}
          >
            Add unsecure iframe
          </button>
          {this.state.iframe && <iframe srcDoc={"<script>alert(0)</script>"}></iframe>}
        </p>
      </div>
    )
  }
}

export default Home
