import React from 'react';
import { AUTH_TOKEN } from '../constant'
import { timeDifferenceForDate } from '../utils'

class Link extends React.Component {

    render(){
        const authToken = localStorage.getItem(AUTH_TOKEN);
        return(
            <div className="flex m2 items-start">
                <div className="flex items-center">
                    <span className="gray">
                        {this.props.index + 1}
                        {authToken && (
                            <div
                                className="mll gray fill"
                                onClick={() => this._voteForLink()}
                            >
                                ▲
                            </div>
                        )}
                    </span>
                    <div className="mll">
                        <div>
                            {this.props.link.description} ({this.props.link.url})
                        </div>
                        <div className="f6 lh-copy gray">
                            {this.props.link.votes.length} votes | by{' '}
                            {this.props.link.postedBy
                                ? this.props.link.postedBy.name
                                : 'Unknown'}{''}
                            {timeDifferenceForDate(this.props.link.createdAt)}
                        </div>
                    </div>
                </div>
            </div>
        )
        // return(
        //     <div>
        //         <div>
        //             {this.props.link.description} ({this.props.link.url})
        //         </div>
        //     </div>
        // )
    }
}

export default Link;