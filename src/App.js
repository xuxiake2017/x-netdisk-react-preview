import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
} from 'react-router-dom';
import MaterialUIDemo1 from './MaterialUIDemo1';
import Navbar from './components/NavBar';
import Login from "./components/Login";
import { connect } from "react-redux"
import { setClientHeight, setClientWidth } from "./actions";
import { CssBaseline } from "@material-ui/core";
import Home from "./components/Home";

const mapStateToProps = (state, ownProps) => {
    return {
        clientHeight: state.appInfo.clientHeight,
        clientWidth: state.appInfo.clientWidth
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setClientHeight: (clientHeight) => {
            dispatch(setClientHeight(clientHeight))
        },
        setClientWidth: (clientWidth) => {
            dispatch(setClientWidth(clientWidth))
        }
    }
}

class App extends React.Component {

    componentDidMount() {

        this.clientHeight = `${document.documentElement.clientHeight}`
        this.clientWidth = `${document.documentElement.clientWidth}`
        this.props.setClientHeight(this.clientHeight)
        this.props.setClientWidth(this.clientWidth)
        window.addEventListener('resize', () => {
            this.clientHeight = `${document.documentElement.clientHeight}`
            this.clientWidth = `${document.documentElement.clientWidth}`
            this.props.setClientHeight(this.clientHeight)
            this.props.setClientWidth(this.clientWidth)
        })
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <Router>
                    <div>
                        <Switch>
                            <Route path="/login">
                                <Login/>
                            </Route>
                            <Route path="/home">
                                <Home/>
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </React.Fragment>
        )
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
