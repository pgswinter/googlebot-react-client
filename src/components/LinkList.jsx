import React from 'react';
import Link from './Link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag'

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        url
        description
      }
    }
  }
`

class LinkList extends React.Component {
    render() {
        const linksToRender = [
            {
                id: '1',
                description: 'Prisma replaces traditional ORMs and makes it easy to build GraphQL servers 😎',
                url: 'https://www.prisma.io',
            },
            {
            id: '2',
            description: 'The best GraphQL client',
            url: 'https://www.apollographql.com/docs/react/',
            },
        ]

        return (
            <Query query={FEED_QUERY}>
                {({loading, error, data}) => {
                    if(loading) return <div>Fetching</div>
                    if(error) return <div>Error</div>

                    const linksToRender = data.feed.links

                    return (
                        <div>
                            {linksToRender.map(link => <Link key={link.id} link={link} />)}
                        </div>
                    )
                }}
                {/* {() => linksToRender.map(link => <Link key={link.id} link={link} />)} */}
            </Query>
            // <div>{linksToRender.map(link => <Link key={link.id} link={link} />)}</div>
        )
    }
}

export default LinkList