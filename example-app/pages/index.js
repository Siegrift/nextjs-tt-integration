import React from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import Script from '../components/script'

const DynamicScript = dynamic(() => import('../components/script'), { ssr: false });

const noop = (i) => i
const rules = {
  createHTML: noop,
  createURL: noop,
}

class Home extends React.Component {
  state = {
    hrefText: '',
    href: '',
    html: '',
    nodes: [],
    withPolicy: true,
    iframe: false,
  }
  appPolicy
  policy = rules

  componentDidMount() {
    this.appPolicy = window.TrustedTypes.createPolicy('app-policy', rules)
    this.policy = this.appPolicy
  }

  togglePolicy = (withPolicy) => () => {
    if (withPolicy) {
      this.policy = this.appPolicy
    } else {
      this.policy = rules
    }
    this.setState({withPolicy})
  }

  render() {
    return (
      <div>
        <Head title="Home" />

        <div>
          <label>
            <input
              type="radio"
              onChange={this.togglePolicy(true)}
              checked={this.state.withPolicy}
            />
            with policy
          </label>
          <label>
            <input
              type="radio"
              onChange={this.togglePolicy(false)}
              checked={!this.state.withPolicy}
            />
            without policy
          </label>
        </div>
        
        {/* Html is not using trusted types, and it it still added to DOM without error on SSR. */}
        <div dangerouslySetInnerHTML={{__html: '<script>console.log("GAME OVER WITH SSR");</script>'}}></div>

        {/* Link is not using trusted types, but there is no error on SSR. */}
        {/* However, you will get an error in hot reload module if you try to return to this page on client*/}
        <Link href="https://github.com/zeit/next.js#getting-started">
          <a>
            <p>Link with constant value</p>
          </a>
        </Link>

        <div>
          {/* Router.push is using TT so you can safely change routes. */}
          <button onClick={() => Router.push('/about')}>About route</button>

          {/* This will trigger an error and nextjs will try to load it's default (trusted) error page. */}
          <button onClick={() => Router.push('/nonExistent')}>Non-existent route</button>
        </div>

        <div>
          {/* Trigger xss */}
          <Link href='/xss-hacky1?html=<img%20src=%27x%27%20onerror="alert(1)">'>
            <button>
              Xss 1 (with policy)
            </button>
          </Link>
          <Link href='/xss-hacky2?html=<img%20src=%27x%27%20onerror="alert(1)">'>
            <button>
              Xss 2 (with policy)
            </button>
          </Link>
          <Link href='/xss-hacky3?html=<img%20src=%27x%27%20onerror="alert(1)">'>
            <button>
              Xss 3 (with policy)
            </button>
          </Link>
        </div>

        {/* This will cause an violation of TT (on client) if href is not trusted. */}
        <p>
          <a href={this.policy.createURL(this.state.href)}>Link with custom href</a>
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
            <span key={i} dangerouslySetInnerHTML={{__html: this.policy.createHTML(n)}} />
            ))}
        </p>

        {/* This is rendered differently on server and on client. */}
        {/* <Script /> */}
        
        {/* React can't execute dynamic scripts: react-dom/src/client/ReactDOMComponent.js */}
        <DynamicScript />
        
        {/* Will try to add iframe with srcdoc. */}
        <p>
          <button
            onClick={() => this.setState({iframe: true})}
          >
            Add unsecure iframe
          </button>
          {this.state.iframe && <iframe srcDoc={this.policy.createHTML("<script>alert(0)</script>")}></iframe>}
        </p>
      </div>
    )
  }
}

export default Home
