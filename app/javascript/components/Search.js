import React, { useLayoutEffect } from "react"
import PropTypes from "prop-types"
class Search extends React.Component {
  // 初期設定
  constructor(props){
    super(props)
    this.state = {
      // isKeyword: this.props.keyword,
      // idDateStart: this.props.datestart,
      // isDateEnd: this.props.dateend,
      // isResult: this.props.result
    }
  }

  // getPostContent(){
  //   const authToken = document.querySelector('meta[name="csrf-token"]');
  //   const contentBody = {
  //     keyword: this.state.isKeyword,
  //     datestart: this.state.idDateStart,
  //     dateend: this.state.isDateEnd
  //     };
  //   const fetchUrl = `/users/${this.props.user.id}/contents/search`
  //   const requestOptions = {
  //   method: "POST",
  //   headers: new Headers({ 
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //     'X-CSRF-Token': authToken.content
  //   }),
  //   body: JSON.stringify(contentBody)
  //   };

  //   fetch(`${fetchUrl}`, requestOptions)
  //   .then(res => {if(!res.ok){
  //     return (
  //       alert("Error, unable to get posts")
  //     );
  //   } else {
  //     return res.json()
  //   }})
  //   .then((response) => {
  //     this.setState({isResult: response.result})
  //     return null
  //   });
  // };

  render(){
    const diaryList = [];
    const memoList = [];
    if(this.props.result.result[0] != [] && this.props.result.result[1] != []){
      for(let i = 0; i < this.props.result.result[0].length; i++){
        diaryList.push(
          <label key={"content-diary-label"+`${i}`} htmlFor={"content-diary"+`${i}`} className="diary-label"><a href={`/diaries/${this.props.result.result[0][i].id}`}>Edit</a></label>,
          <li key={"content-diary"+`${i}`} id={"content-diary"+`${i}`} className="diary-content">{this.props.result.result[0][i].content}</li>,
        )
      for(let i = 0; i < this.props.result.result[1].length; i++){
        memoList.push(
          <label key={"content-memo-label"+`${i}`} htmlFor={"content-memo"+`${i}`} className="memo-label"><a href={`/memos/${this.props.result.result[1][i].id}`}>Edit</a></label>,
          <li key={"content-memo"+`${i}`} id={"content-memo"+`${i}`} className="memo-content">{this.props.result.result[1][i].content}</li>,
        )
      }
    }  
    }else if (this.props.result.result[0] != []){
      for(let i = 0; i < this.props.result.result[1].length; i++){
        diaryList.push(
          <label key={"content-diary-label"+`${i}`} htmlFor={"content-diary"+`${i}`} className="diary-label"><a href={`/diaries/${this.props.result.result[0][i].id}`}>Edit</a></label>,
          <li key={"content-diary"+`${i}`} id={"content-diary"+`${i}`} className="diary-content">{this.props.result.result[0][i].content}</li>,
        )
      }
    }else if (this.props.result.result[1] != []){
      for(let i = 0; i < this.props.result.result[1].length; i++){
        diaryList.push(
          <label key={"content-memo-label"+`${i}`} htmlFor={"content-memo"+`${i}`} className="memo-label"><a href={`/memos/${this.props.result.result[1][i].id}`}>Edit</a></label>,
          <li key={"content-memo"+`${i}`} id={"content-memo"+`${i}`} className="memo-content">{this.props.result.result[1][i].content}</li>,
        )
      }
    } 
    return(
      <div className="show-contents">
        <div className="contents-posts">
          <div className="lists">
            <p id="post-title">日記</p>
          </div>
          <ul className="content-list">
            {diaryList}
          </ul>
        </div>
        <div className="contents-posts">
          <div className="lists">
            <p id="post-title">メモ</p>
          </div>
          <ul className="content-list">
            {memoList}
          </ul>
        </div>
      </div>
    )
  }
}
export default Search