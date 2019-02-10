import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import { AUTH_TOKEN } from '../constant'

class Header extends React.Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return(
            <div>
                <div>
                    <div>
                        Hacker news
                    </div>
                    <Link to="/">
                        new
                    </Link>
                    {
                        authToken && (
                            <div>
                                <div> | </div>
                                <Link to="/create">
                                    submit
                                </Link>
                            </div>
                        )
                    }
                </div>
                <div>
                    {authToken ? (
                        <button
                            onClick={ () => {
                                localStorage.removeItem(AUTH_TOKEN)
                                this.props.history.push(`/`)
                            }}
                        >
                            logout
                        </button>
                    ) : 
                    (
                        <Link to='/login'>
                            login
                        </Link>
                    )
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Header);