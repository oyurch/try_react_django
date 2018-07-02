import React, {Component} from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import moment from 'moment'


class PostForm extends Component {
    constructor(props) {
        super(props);
        this.titleRef = React.createRef();
        this.state = {
            draft: false,
            title: "",
            content: "",
            publish: null
        };
    }
    createPost(data) {
        const endpoint = '/api/posts/';
        const csrfToken = cookie.load('csrftoken');
        const that = this;
        if (csrfToken !== undefined) {
            let lookupOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken

                },
                body: JSON.stringify(data),
                credentials: 'include'
            };

            fetch(endpoint, lookupOptions)
                .then(function (response) {
                    return response.json()
                })
                .then(function (responseData) {
                    if (that.props.newPostItemCreated) {
                        that.props.newPostItemCreated(responseData)
                    }
                    that.clearForm()
                })
                .catch(function (error) {
                    console.log('error', error)
                })
        }

    }
    updatePost(data) {
        const {post} = this.props;
        const endpoint = `/api/posts/${post.slug}/`;
        const csrfToken = cookie.load('csrftoken');
        const that = this;
        if (csrfToken !== undefined) {
            let lookupOptions = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken

                },
                body: JSON.stringify(data),
                credentials: 'include'
            };

            fetch(endpoint, lookupOptions)
                .then(function (response) {
                    return response.json()
                })
                .then(function (responseData) {
                    if (that.props.newPostItemUpdated) {
                        that.props.newPostItemUpdated(responseData)
                    }
                })
                .catch(function (error) {
                    console.log('error', error)
                })
        }

    }

    handleSubmit = (event) => {
        event.preventDefault();
        let data = this.state;
        const {post} = this.props;

        if (post !== undefined) {
            this.updatePost(data)
        } else {
            this.createPost(data)
        }

    };

    handleInputChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleDraftChange = () => {
        this.setState({
            draft: !this.state.draft
        })
    };


    componentDidMount() {
        const {post} = this.props;
        if (post !== undefined) {
            this.setState({
                draft: post.draft,
                title: post.title,
                content: post.content,
                publish: moment(post.publish).format('YYYY-MM-DD')
            });
        } else {
            this.setState({
                draft: false,
                title: "",
                content: "",
                publish: moment().format('YYYY-MM-DD')
            });
        }
        this.titleRef.current.focus()
    }

    clearForm = (event) => {
        if (event) {
            event.preventDefault()
        }
        this.postCreateForm.reset();
        this.setState({
            draft: false,
            title: "",
            content: "",
            publish: null
        });
    };

    render() {
        const {publish} = this.state;
        const {title} = this.state;
        const {content} = this.state;
        return (
            <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
                <div className="form-group">
                    <label for="title">Post title</label>
                    <input
                        ref={this.titleRef}
                        type="text"
                        id="title"
                        name='title'
                        value={title}
                        className='form-control'
                        placeholder='Blog post title'
                        onChange={this.handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name='content'
                        value={content}
                        className='form-control'
                        placeholder='Blog post contnet'
                        onChange={this.handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="draft">
                        <input type="checkbox" checked={this.state.draft} id="draft" name='draft'className="mr-2" placeholder='Draft' onChange={this.handleDraftChange}/>
                    Draft</label>
                    <button onClick={(event)=> {event.preventDefault();this.handleDraftChange()}}>Toggle draft</button>
                </div>
                <div className="form-group">
                    <label htmlFor="publish">Publish date</label>
                    <input type="date" value={publish} id="publish" name='publish' className='form-control' placeholder='Blog post publish' onChange={this.handleInputChange}/>
                </div>
                <button className="btn btn-primary">Save</button>
                <button className={`btn btn-secondary ${this.props.post === undefined ? "d-block" : "d-none"}`} onClick={this.clearForm}>Clear</button>
            </form>
        )
    }
}

export default PostForm