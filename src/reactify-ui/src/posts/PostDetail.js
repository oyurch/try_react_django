import React, { Component } from 'react'


class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slug: null
        }
    }

    componentDidMount() {
        this.setState({
           slug: null
        });
        if (this.props.match) {
            const {slug} = this.props.match.params;
            this.setState({
                slug: slug
            })
        }
    }
    render () {
        const {slug} = this.state;
        return (
            <p>{(slug !== null) ? <div>{slug}</div>: ""}</p>
        )
    }
}

export default PostDetail