import React from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import { FEED_QUERY } from './LinkList'

const POST_MUTATION = gql `
    mutation PostMutation($description: String!, $url: String!) {
        post(description: $description, url: $url) {
            id
            url
            description
        }
    }
`

class CreateLink extends React.Component {
    state = {
        description: '',
        url: ''
    }
    render() {
        const {description, url} = this.state;
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={description}
                        onChange={e => this.setState({description: e.target.value})}
                        placeholder="A description for the link"
                        type="text"
                    />
                    <input
                        className="mb2"
                        value={url}
                        onChange={e => this.setState({url: e.target.value})}
                        placeholder="The URL for the link"
                        type="text"
                    />
                </div>
                <Mutation
                    mutation={POST_MUTATION}
                    variables={{description, url}}
                    onCompleted={() => this.props.history.push('/new/1')}
                    update={(store, { data: {post}}) => {
                        const data = store.readQuery({query: FEED_QUERY })
                        data.feed.links.unshift(post)
                        store.writeQuery({
                            query: FEED_QUERY,
                            data
                        })
                    }}
                >
                    {postMutation => <button onClick={postMutation}>Submit</button>}
                </Mutation>
                {/* <butto onClick={`... you'll implement this`}>Submit</butto> */}
            </div>
        )
    }
}

export default CreateLink