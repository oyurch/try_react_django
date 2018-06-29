import React, { Component } from 'react';
import 'whatwg-fetch'
import cookie from 'react-cookies'

import PostCreate from './PostCreate'
import PostInline from './PostInline'

class Posts extends Component {
    constructor(props) {
        super(props);
        this.togglePostsListClass = this.togglePostsListClass.bind(this)
    }

    state = {
        posts: [],
        postsListClass: 'card'
    };

    loadPosts() {
        const endpoint = '/api/posts';
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
                that.setState({
                    posts: responseData
                })
            })
            .catch(function (error) {
                console.log('error', error)
            })
    }

    handleNewPost = (event, postItemData) => {
        console.log(postItemData)
        let currentPosts = this.state.posts;
        currentPosts.unshift(postItemData)
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
            postsListClass: "card"
        });
        this.loadPosts()
    }

  render() {
    const {posts} = this.state;
    const {postsListClass} = this.state;
    const csrfToken = cookie.load('csrftoken');
    return (
      <div>
        <h1>Hello world</h1>
          <button onClick={this.togglePostsListClass}>Toggle class</button>
          {posts.length > 0 ? posts.map((postItem, index) => {
              return (
                  <PostInline post={postItem} elClass={postsListClass}/>
              )
          }):<p>No post found</p>}
          {(csrfToken !== undefined && csrfToken !== null) ?
              <div className="my-5">
                  <PostCreate newPostItemCreated={this.handleNewPost}/>
              </div>
          : ""}
      </div>
    );
  }
}

export default Posts;
