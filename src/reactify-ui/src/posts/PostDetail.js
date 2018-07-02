import React, { Component } from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

import PostForm from './PostForm'

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slug: null,
            post: null,
            doneLoading: false,
        }
    }
    loadPost(slug) {
        const endpoint = `/api/posts/${slug}/`;
        const that = this;
        let lookupOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const csrfToken = cookie.load('csrftoken');
        if (csrfToken !== undefined) {
            lookupOptions['credentials'] = 'include';
            lookupOptions['headers']['X-CSRFToken'] = csrfToken;
        }

        fetch(endpoint, lookupOptions)
            .then(function (response) {
                return response.json()
            })
            .then(function (responseData) {
                if (responseData.detail) {
                    that.setState({
                        doneLoading: true,
                        post: null
                    })
                } else {
                    that.setState({
                        doneLoading: true,
                        post: responseData
                    })
                }
            })
            .catch(function (error) {
                console.log('error', error)
            })
    }
    componentDidMount() {
        this.setState({
            post: null,
            doneLoading: false,
        });
        if (this.props.match) {
            const {slug} = this.props.match.params;
            this.loadPost(slug)
        }
    }
    handlePostItemUpdated = (postItemData) => {
        this.setState({
            post: postItemData
        })

    };
    render () {
        const {post} = this.state;
        const {doneLoading} = this.state;
        return (
            <p>
                {(doneLoading === true)?
                    <div>
                    {(post === null)? "Not found":
                        <div>
                            <p>
                            {(post.owner === true)? <Link
                                maintainScrollPosition={false}
                                to={{
                                    pathname: `/posts/create`,
                                    state: {fromDashboard: false}
                                }}
                            >Create post</Link>:""}
                            <Link
                                maintainScrollPosition={false}
                                to={{
                                    pathname: `/posts`,
                                    state: {fromDashboard: false}
                                }}
                            >Back to Posts</Link>
                            </p>
                            <h1>{post.title}</h1>
                            <p>{post.content}</p>
                            <p className='small'>{post.publish}</p>
                            <p>{(post.slug !== null) ? <div>{post.slug}</div>: ""}</p>
                            {(post.owner === true)? <PostForm post={post} newPostItemUpdated={this.handlePostItemUpdated}/>: ""}
                        </div>
                    }
                    </div>
                    : 'loading...'}
            </p>
        )
    }
}

export default PostDetail