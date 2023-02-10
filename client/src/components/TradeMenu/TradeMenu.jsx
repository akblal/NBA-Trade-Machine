import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { TeamContext } from '../../App.jsx';

import DisplayOriginalTeam from '../DisplayOriginalTeam/DisplayOriginalTeam.jsx';
import DisplayGuard from '../DisplayOriginalTeam/DisplayGuard.jsx';
import DisplaySmallForward from '../DisplayOriginalTeam/DisplaySmallForward.jsx';
import DisplayForward from '../DisplayOriginalTeam/DisplayForward.jsx';
import DisplayPowerForward from '../DisplayOriginalTeam/DisplayPowerForward.jsx';
import DisplayCenter from '../DisplayOriginalTeam/DisplayCenter.jsx';
import DisplayDraftPicks from '../DisplayOriginalTeam/DisplayDraftPicks.jsx';
import TradeButtonFunction from './TradeButtonFunction.jsx';
import TradeGuardFromOne from '../TradedPlayers/TradeGuardFromOne.jsx';
import TradeSmallForwardFromOne from '../TradedPlayers/TradeSmallForwardFromOne.jsx';
import TradeForwardFromOne from '../TradedPlayers/TradeForwardFromOne.jsx';
import TradePowerForwardFromOne from '../TradedPlayers/TradePowerForwardFromOne.jsx';
import TradeCenterFromOne from '../TradedPlayers/TradeCenterFromOne.jsx';
import DisplayTeamTwo from '../DisplayOriginalTeam/DisplayTeamTwo.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLeft } from '@fortawesome/free-solid-svg-icons';

function TradeMenu () {
  const {team} = useContext(TeamContext);
  const [secondTeam, setSecondTeam] = useState();
  const [secondTeamPlayers, setSecondTeamPlayers] = useState([])
  const [teamDraftPicks, setTeamDraftPicks] = useState(null);
  const [addToTwo, setAddToTwo] = useState([]);
  const [oneToTwo, setOneToTwo] = useState([]);
  const [tradeToOne, setTradeToOne] = useState([]);
  const [tradeBlockSalaryOne, setTradeBlockSalaryOne] = useState(0);
  const [tradeBlockSalaryTwo, setTradeBlockSalaryTwo] = useState(0);

  const [addToOne, setAddToOne] = useState([]);
  const [twoToOne, setTwoToOne] = useState([]);
  const [playerTradeToTwo, setPlayerTradeToTwo] = useState([]);

  const handleTeam2 = (team2) => {
    setSecondTeam(team2);
    getPlayers(team2);
    getPicks(team2);
  }

  const getPlayers = (team) => {
    axios.get('/playersFromTeam', {
      params: {
        team
      }
    })
    .then((results) => {
      let players = results.data;
      setSecondTeamPlayers(players.slice())
    })
    .catch ((err) => {
      console.log (err, 'err from get request in DisplayOriginalTeam')
    })
  }

  const getPicks = (team) => {
    axios.get('/draftPicks', {
      params: {
        team
      }
    })
    .then((results) => {
      let picks = results.data[0];
      setTeamDraftPicks(picks);
    })
    .catch ((err) => {
      console.log (err, 'err from get request in getting draft picks')
    })
  }

  const tradeToTwo = (player) => {
    setOneToTwo([]);
    let temp = addToTwo.slice();
    temp.push(player);
    setAddToTwo(temp);
    setOneToTwo([player])
    getSalaryTradeBlockOne(temp);
  }

  const teamTwoToTrade = (player) => {
    setTwoToOne([]);
    let temp = addToOne.slice();
    temp.push(player);
    setAddToOne(temp);
    setTwoToOne([player]);
    getSalaryTradeBlockTwo(temp);
    let team = [];
    for (let i = 0; i < secondTeamPlayers.length; i++) {
      if (secondTeamPlayers[i].name != player.name) {
        team.push(secondTeamPlayers[i])
      }
    }
    setSecondTeamPlayers(team)
  }

  const removePlayerFromTeam1Block = (player) => {
    let temp = [];
    let copy = addToTwo.slice();
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].name != player.name) {
        temp.push(copy[i])
      }
    }
    setAddToTwo(temp.slice());
    setTradeToOne([player])
    getSalaryTradeBlockOne(temp);
  }

  const removePlayerFromTeam2Block = (player) => {
    let temp = [];
    let copy = addToOne.slice();
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].name != player.name) {
        temp.push(copy[i])
      }
    }
    setAddToOne(temp.slice());
    setPlayerTradeToTwo([player])
    getSalaryTradeBlockTwo(temp);
    let copyPlayersTeamTwo = secondTeamPlayers.slice();
    copyPlayersTeamTwo.push(player)
    setSecondTeamPlayers(copyPlayersTeamTwo)
  }

  const getSalaryTradeBlockOne = (list) => {
    let salary = 0;
    for (let i = 0; i < list.length; i++) {
      let player = list[i];
      salary += Number((player.salary).split(',').join('').split('$').join(''));
    }
    setTradeBlockSalaryOne(salary);
  }

  const getSalaryTradeBlockTwo = (list) => {
    let salary = 0;
    for (let i = 0; i < list.length; i++) {
      let player = list[i];
      salary += Number((player.salary).split(',').join('').split('$').join(''));
    }
    setTradeBlockSalaryTwo(salary);
  }

  return (
    <div className= 'trade-menu-container'>
      <div>
        <DisplayOriginalTeam tradeToTwo= {tradeToTwo} oneToTwo= {oneToTwo} tradeToOne= {tradeToOne}/>
      </div>
      <div>
      {addToOne.length ?
        <div>
          {tradeBlockSalaryOne && <h1>{'$'+(tradeBlockSalaryTwo.toLocaleString())}</h1>}
          <TradeGuardFromOne playersOnTeam= {addToOne} removePlayerFromTeam1Block= {removePlayerFromTeam2Block}/>
          <TradeSmallForwardFromOne playersOnTeam= {addToOne} removePlayerFromTeam1Block= {removePlayerFromTeam2Block}/>
          <TradeForwardFromOne playersOnTeam= {addToOne} removePlayerFromTeam1Block= {removePlayerFromTeam2Block}/>
          <TradePowerForwardFromOne playersOnTeam= {addToOne} removePlayerFromTeam1Block= {removePlayerFromTeam2Block}/>
          <TradeCenterFromOne playersOnTeam= {addToOne} removePlayerFromTeam1Block= {removePlayerFromTeam2Block}/>
        </div>
        : null}
      </div>
      <div>
        {!secondTeam ?
          <TradeButtonFunction handleTeam2= {handleTeam2}/>
          : null}
        {addToTwo.length ?
          <div>
            {tradeBlockSalaryOne && <h1>{'$'+(tradeBlockSalaryOne.toLocaleString())}</h1>}
            <TradeGuardFromOne playersOnTeam= {addToTwo} removePlayerFromTeam1Block= {removePlayerFromTeam1Block}/>
            <TradeSmallForwardFromOne playersOnTeam= {addToTwo} removePlayerFromTeam1Block= {removePlayerFromTeam1Block}/>
            <TradeForwardFromOne playersOnTeam= {addToTwo} removePlayerFromTeam1Block= {removePlayerFromTeam1Block}/>
            <TradePowerForwardFromOne playersOnTeam= {addToTwo} removePlayerFromTeam1Block= {removePlayerFromTeam1Block}/>
            <TradeCenterFromOne playersOnTeam= {addToTwo} removePlayerFromTeam1Block= {removePlayerFromTeam1Block}/>
          </div>
          : null}
      </div>
      <div>
        {secondTeamPlayers.length && teamDraftPicks?
          <div>
            <DisplayTeamTwo oneToTwo= {twoToOne} playersOnTeam= {secondTeamPlayers} tradeToTwo= {teamTwoToTrade} teamDraftPicks= {teamDraftPicks} tradeToOne= {playerTradeToTwo} secondTeam= {secondTeam}/>
          </div>
        : <h2>players not shown</h2>}
      </div>
    </div>
  )
}

export default TradeMenu
