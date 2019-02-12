import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag'

const POST_MUTATION = gql `
    mutation PostMutation($description: String!, $url: String!) {
        post(description: $description, url: $url) {
            id,
            url,
            description
        }
    }
`

export class CreateLink extends React.Component {
    state = {
        description: '',
        url: '',
    };

    render() {
        const {description, url} = this.state;
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        type="text"
                        className="mb2"
                        value={description}
                        onChange={e => this.setState({description: e.target.value})}
                        placeholder="A description for the link"
                    />
                    <input
                        type="text"
                        className="mb2"
                        value={url}
                        onChange={e => this.setState({url: e.target.value})}
                        placeholder="The URL for the link"
                    />
                    <Mutation mutation={POST_MUTATION} variables={{description, url}}>
                        {postMutation  => (
                            <button onClick={postMutation}>
                                Submit
                            </button>
                        )}
                    </Mutation>
                    {/* <button onClick={`... you'll implement this 🔜`}>Submit</button> */}
                </div>
            </div>
        )
    }
}

export default CreateLink