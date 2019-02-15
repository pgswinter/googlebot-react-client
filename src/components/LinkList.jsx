import React from 'react';
import Link from './Link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {LINKS_PER_PAGE} from '../constant';

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        url
        description
        postedBy {
          id
          name
        }
        # votes {
        #   id
        #   user {
        #     id
        #   }
        # }
      }
      count
    }
  }
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        postedBy {
          id
          name
        }
        # votes {
        #   id
        #   user {
        #     id
        #   }
        # }
      }
      user {
        id
      }
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      postedBy {
        id
        name
      }
      # votes {
      #   id
      #   user {
      #     id
      #   }
      # }
    }
  }
`

class LinkList extends React.Component {

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'description_ASC' : null

    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })
    // const data = store.readQuery({ query: FEED_QUERY })
  
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
  
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewVotes = subscribeToMore  => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    })
  }
  _subscribeToNewLinks = subscribeToMore => {
      subscribeToMore({
          document: NEW_LINKS_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev
              const newLink = subscriptionData.data.newLink
              const exists = prev.feed.links.find(({ id }) => id === newLink.id);
              if (exists) return prev;
              return Object.assign({}, prev, {
                  feed: {
                      links: [newLink, ...prev.feed.links],
                      count: prev.feed.links.length + 1,
                      __typename: prev.feed.__typename
                  }
              })
          }
      })
  }
  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'description_ASC' : null
    return { first, skip, orderBy }
  }

  _getLinksToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  render() {
    return (
        <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
            {({loading, error, data, subscribeToMore }) => {
                if(loading) return <div>Fetching</div>
                if(error) return <div>Error</div>

                this._subscribeToNewLinks(subscribeToMore)
                this._subscribeToNewVotes(subscribeToMore)

                const linksToRender = this._getLinksToRender(data)
                const isNewPage = this.props.location.pathname.includes('new')
                const pageIndex = this.props.match.params.page
                  ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
                  : 0

                return (
                  <React.Fragment>
                    {linksToRender.map((link, index) => (
                            <Link
                                key={link.id}
                                link={link}
                                index={index} 
                                updateStoreAfterVote={this._updateCacheAfterVote}
                            />
                    ))}
                    {
                      isNewPage && (
                        <div>
                          <div onClick={this._previousPage}>
                            Previous
                          </div>
                          <div onClick={() => this._nextPage(data)}>
                            Next
                          </div>
                        </div>
                      )
                    }
                  </React.Fragment>
                    
                    // <div>
                    //     {linksToRender.map(link => <Link key={link.id} link={link} />)}
                    // </div>
                )
            }}
            {/* {() => linksToRender.map(link => <Link key={link.id} link={link} />)} */}
        </Query>
        // <div>{linksToRender.map(link => <Link key={link.id} link={link} />)}</div>
    )
  }
}

export default LinkList