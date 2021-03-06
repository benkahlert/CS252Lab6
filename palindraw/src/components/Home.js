import React, { Component } from "react"
import rebase, { auth } from "../re-base.js"
import { Route, Switch, Redirect } from "react-router-dom"
import Waiting from "./Waiting"
import Gallery from "./Gallery"
import Draw from "./Draw"
import "../css/Home.css"

class Home extends Component {

    // Constructor
    constructor() {
        super()
        this.state = {
            queue: { },
            width: 0
        }
    }

    componentDidMount = () => {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({width: window.innerWidth});
    }

    draw = () => {

        const words = ['Racecar', 'Kayak', 'Noon', 'Tenet', 'Wow', 'Rotor', 'Mom', 'My gym', 'Top spot', 'No lemon, no melon',
        'Level', 'Radar', 'Refer', 'Sexes', 'Rotator']
        const word = words[Math.floor(Math.random() * words.length)]

        rebase.fetch(`/queue`, {
            context: this,
            then: (data) => {
                const dataArray = Object.keys(data)
                if (dataArray.length === 1) {
                    // Nothing in queue
                    rebase.post(`/queue/${this.props.getAppState().user.uid}`, {
                        data: word,
                        then: () => {
                            this.props.setAppState({word: word})
                            this.props.goToUrl("/waiting")
                        }
                    })
                } else {
                    // Someone is waiting
                    const keys = Object.keys(data)
                    let key = keys[0]
                    if (keys[0] === "example") {
                        key = keys[1]
                    }
                    rebase.remove(`/queue/${key}`, (error) => {
                        if (error !== null) {
                            console.log(error)
                        }
                    })
                    this.props.setAppState({inGame: true})
                    this.props.setAppState({word: data[key]})
                    this.props.setAppState({opponentId: key})
                    this.props.goToUrl("/draw")
                }
            }
        })
    }

    signOut = () => {
        auth.signOut()
    }

    playButton = () => {
        if (this.state.width < 700) {
            return (<div></div>)
        } else {
            return (
                <button className="button" id="playButton" onClick={this.draw}>PLAY</button>
            )
        }
    }

    // Mandatory render method
    render() {

        const general = {
            getAppState: this.props.getAppState,
            setAppState: this.props.setAppState,
            goToUrl: this.props.goToUrl
        }

        let playButton = this.playButton()


        console.log(this.props.getAppState())
        let winKeys = []
        let lossKeys = []
        if (this.props.getAppState().user.numWins) {
            winKeys = Object.keys(this.props.getAppState().user.numWins)
            lossKeys = Object.keys(this.props.getAppState().user.numLosses)
        }

        return (
            <div>
                <Switch>
                    <Route exact path="/home" render={() => {
                        return (
                            <div>
                                <div id="titleBar">
                                    <div className="contentContainer" id="titleBarContent">
                                        <p className="title_text" id="homescreenLogo" style={{marginTop: '0px'}}>Palindraw</p>
                                        <div className="row" id="titleRightInfo">
                                            <p className="text_description" id="titleBarName">{this.props.getAppState().user.email}</p>
                                            {playButton}
                                            <div className="statsBox">
                                                <p className="statsInfo">🎉 {winKeys.length - 1}</p>
                                            </div>
                                            <div className="statsBox">
                                                <p className="statsInfo">😔 {lossKeys.length - 1}</p>
                                            </div>
                                            <button className="button" id="signOutButton" onClick={this.signOut}>Sign out</button>
                                        </div>
                                    </div>
                                </div>

                                <Gallery { ...general } />
                            </div>
                        )
                    }}/>
                    <Route exact path="/waiting" render={() => {
                        return <Waiting { ...general } />
                    }}/>
                    <Route exact path="/draw" render={() => {
                        return <Draw { ...general } />
                    }}/>
                </Switch>
            </div>
        )
    }
}

export default Home
