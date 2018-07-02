import React, { Component } from 'react';
import 'whatwg-fetch'
import cookie from 'react-cookies'
import { Link } from 'react-router-dom';

import PostInline from './PostInline'

class Posts extends Component {
    constructor(props) {
        super(props);
        this.togglePostsListClass = this.togglePostsListClass.bind(this)
        this.state = {
            posts: [],
            postsListClass: 'card',
            next: null,
            previous: null,
            author: false,
            count: 0
        };
    }

    loadMorePosts = () => {
        const {next} = this.state;
        if (next !== null || next !== undefined) {
            this.loadPosts(next)
        }
    };

    loadPosts(nextEndpoint) {
        let endpoint = '/api/posts/';
        if (nextEndpoint !== undefined) {
            endpoint = nextEndpoint
        }
        const that = this;
        let lookupOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch(endpoint, lookupOptions)
            .then(function (response) {
                return response.json()
            })
            .then(function (responseData) {
                let currentPosts = that.state.posts;
                let newPosts = currentPosts.concat(responseData.results);
                that.setState({
                    posts: newPosts,
                    next: responseData.next,
                    previous: responseData.previous,
                    author: responseData.author,
                    count: responseData.count
                })
            })
            .catch(function (error) {
                console.log('error', error)
            })
    }

    handleNewPost = (postItemData) => {
        let currentPosts = this.state.posts;
        currentPosts.push(postItemData);
        this.setState({
            posts:currentPosts
        })
    };

    togglePostsListClass(event) {
        event.preventDefault();

        let currentListClass = this.state.postsListClass;
        if (currentListClass === '') {
            this.setState({
                postsListClass: 'card'
            })
        } else {
            this.setState({
                postsListClass: ''
            })
        }
    }

    componentDidMount() {
        this.setState({
            posts: [],
            postsListClass: "card",
            next: null,
            previous: null,
            author: false,
            count: 0
        });
        this.loadPosts()
    }

  render() {
    const {posts} = this.state;
    const {postsListClass} = this.state;
    const {author} = this.state;
    const {next} = this.state;
    return (
      <div>
        <h1>Hello world</h1>
          <p>
            {author === true ?
                <Link className='mr-2'
                    maintainScrollPosition={false}
                    to={{
                        pathname: `/posts/create`,
                        state: {fromDashboard: false}
                    }}
                >Create post</Link>: ""}
          </p>
          <button onClick={this.togglePostsListClass}>Toggle class</button>
          {posts.length > 0 ? posts.map((postItem, index) => {
              return (
                  <PostInline post={postItem} elClass={postsListClass}/>
              )
          }):<p>No post found</p>}
          {(next !== null) ? <button onClick={this.loadMorePosts}>More posts</button>: ""}
      </div>
    );
  }
}

export default Posts;
