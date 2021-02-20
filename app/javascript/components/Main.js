import React from "react"
import PropTypes from "prop-types"
import Diary from "./Diary"
import Memo from "./Memo"
import PostCreate from "./PostCreate"
import Search from "./Search"
class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isSwitch: this.props.aWeek[3].day,
      isPage: "index",
      isDiaryContents: this.props.diaries,
      isMemoContents: this.props.memos,
      isKeyword: "",
      isDateStart: "",
      isDateEnd: "",
      isResult: ""
    };
  }

  setIndexPage(){
    this.setState({isPage: "index"})
  }

  getPostContent(page){
    const authToken = document.querySelector('meta[name="csrf-token"]');
    let contentBody = "";
    let fetchUrl = "";
    if(this.state.isPage == "index" && !page){
      contentBody = {
        user: this.props.user.id,
        fetch: "ON"
      };
      fetchUrl = `/users/${this.props.user.id}/contents`
    }else if(page == "search"){
      contentBody = {
        keyword: this.state.isKeyword,
        datestart: this.state.isDateStart,
        dateend: this.state.isDateEnd
      };
      fetchUrl = `/users/${this.props.user.id}/contents/search`
    }

    const requestOptions = {
    method: "POST",
    headers: new Headers({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-Token': authToken.content
    }),
    body: JSON.stringify(contentBody)
    };

    fetch(`${fetchUrl}`, requestOptions)
    .then(res => {if(!res.ok){
      return (
        alert("Error, unable to get posts")
      );
    } else {
      return res.json()
    }})
    .then((response) => {
      if(this.state.isPage == "index" && !page){
        this.setState({isDiaryContents: response.diaries})
        this.setState({isMemoContents: response.memos})
        return null  
      }else if(page == "search"){
        this.setState({isResult: response})
        this.setState({isPage: "search"})
        return null
        // return response.result
      }
    });
  };

  renderValue() {
    if(this.state.isPage == "index"){
      return (
        <div className="contents">
          <div className="show-contents">
          <Diary value={this.state.isDiaryContents} day={this.state.isSwitch} />
          <Memo value={this.state.isMemoContents} day={this.state.isSwitch} />
          </div>
        </div>)    
    } else if(this.state.isPage == "diaries" || this.state.isPage == "memos"){
      return(
      <div className="contents">
        <PostCreate value={this.state.isPage} day={this.state.isSwitch} diaries={this.state.isDiaryContents} user={this.props.user} pageMethod={() => this.setIndexPage()} getContentsMethod={() => this.getPostContent()}/>
      </div>
      )} else if(this.state.isPage == "search"){
        return(
        <div className="contents">
          <Search result={this.state.isResult} keyword={this.state.isKeyword} datestart={this.state.isDateStart} dateend={this.state.isDateEnd} user={this.props.user} pageMethod={() => this.setIndexPage()}/>
        </div>)
      }}
  

  render () {
    const weekList = [];
    for (let i = 0; i < this.props.aWeek.length; i++){
      weekList.push(<button onClick={(e)=>{this.setState({isSwitch: [e.target.id]}), this.setIndexPage()}} 
      key={`week${i}`} id={`${this.props.aWeek[i].day}`}>{this.props.aWeek[i].day}<br />{this.props.aWeek[i].wday}</button>)
      };
     return (
      <div className="index-contents">
        <div className="contents-search">
          <input type="search" id="search-box" value={this.state.isKeyword} onChange={(e)=>{this.setState({isKeyword: [e.target.value]})}} placeholder="検索ワードを入力してください"></input><br/>
          <input type="date" id="search-date" value={this.state.isDateStart} onChange={(e)=>{this.setState({isDateStart: [e.target.value]})}}></input>
          <input type="date" id="search-date" value={this.state.isDateEnd} onChange={(e)=>{this.setState({isDateEnd: [e.target.value]})}}></input>
        </div>
        <button id="search-btn" value="search" onClick={(e)=>{this.getPostContent(e.target.value)}}>検索する</button>
        <div className="switch-btn">
          <button id="diary-create-btn" value="diaries" onClick={(e)=>{this.setState({isPage: [e.target.value]})}}>日記投稿</button>
          <button id="memo-create-btn" value="memos" onClick={(e)=>{this.setState({isPage: [e.target.value]})}}>メモ投稿</button>
          <button id="go-to-index-btn" value="index" onClick={(e)=>{this.setState({isPage: [e.target.value]})}}>トップページ</button>
        </div>
        <ul className="day-btn">
          {weekList}
        </ul>
          {this.renderValue()}
      </div>
    );
  }
}

export default Main
