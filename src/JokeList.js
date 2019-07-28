import React, { Component } from 'react';
import axios from 'axios'
import './JokeList.css'
import Joke from './Joke'
import uuid from 'uuid/v4'

class JokeList extends Component{
  
    static defaultProps={
        numJokesToGet :10
    }
    constructor(props){
        super(props)
        this.state ={
            jokes : JSON.parse(window.localStorage.getItem('jokes') || '[]'),
            loading : false 
        }
        this.seenJokes = new Set(this.state.jokes.map(j => j.text))
        this.handleClick= this.handleClick.bind(this)
    }
    async componentDidMount(){
        if(this.state.jokes.length===0)
            this.getJokes()
        
    }

     async getJokes(){
        try{
            let jokes = []
            while(jokes.length < this.props.numJokesToGet){
                let res = await axios.get('https://icanhazdadjoke.com/', 
                {headers : 
                    {Accept : 'application/json'}})
                    let newJokes = res.data.joke
                    if(!this.seenJokes.has(newJokes))
                        jokes.push({id : uuid(), text :newJokes, votes :0})
                    else {

                    }
                }
            this.setState(st => ({
                loading : false,
                jokes : [...st.jokes, ...jokes]
            }),
                ()=> window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
        
            )
        }
        catch(e){
            alert(e)
            this.setState({
                loading: false 
            })
        }
    }

    handleVote(id, delta){
        this.setState(
            st =>({
                jokes : st.jokes.map(j=>
                    j.id === id ? {...j, votes : j.votes + delta} : j 
                )
            }), 
            () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes)) 
        )
    }

    handleClick(){
        this.setState({
            loading: true
        },
            this.getJokes
        )
    } 

    render(){
        if(this.state.loading)
            return(
                <div className="Spin">
                    <i className="far fa-laugh fa-spin fa-8x"/>
                    <h1 className="JokeListTitle">Loading ...</h1>
                </div>
            )
        let jokes = this.state.jokes.sort((a,b)=>b.votes - a.votes)
        return(
            <div className="JokeList">
                <div className="JokeListSideBar">
                    <h1 className="JokeListTitle">
                        <span>Dad </span>
                    Jokes</h1>
                    <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"/>
                    <button onClick={this.handleClick} className="JokeListGetMore"> Fetch Jokes</button>
                </div>
                <div className="JokeListJokes">
                    {jokes.map(j=>(
                        <Joke 
                            upvote={() => this.handleVote(j.id, 1)} 
                            downvote={() => this.handleVote(j.id, -1)} 
                            key={j.id} 
                            votes ={j.votes} 
                            text={j.text}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default JokeList;