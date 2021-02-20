import React from "react"
import PropTypes from "prop-types"
class PostCreate extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isPage: this.props.value,
      isGetResult: "not yet",
      isContentQ1: "",
      isContentQ2: "",
      isContentMemo: ""
    }
  };

  //何かがからになっているせつ。
  // 日記投稿については、
  // ①今日と同じ日付の日記がある
  // ②-a ①のうち、空の日記がある場合：空の日記をfindして編集画面へ。
  // ②-b ①のうち、どちらも空の日記の場合：どちらも削除して新たに空の日記を2つ分作成する。

  postContent(){
    const authToken = document.querySelector('meta[name="csrf-token"]');
    let contentBody = "";
    if(this.props.value == "diaries"){
      debugger
      contentBody = {
        user: this.props.user.id,
        content: [this.state.isContentQ1, this.state.isContentQ2]
      };
    }else{
      contentBody = {
        user: this.props.user.id,
        content: this.state.isContentMemo
      };
    };
    const requestOptions = {
    method: "POST",
    headers: new Headers({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-Token': authToken.content
    }),
    body: JSON.stringify(contentBody)
    };
    fetch(`/${this.state.isPage}`, requestOptions)
    .then(res => {if(!res.ok){
      return (
        alert("Error, unable to post")
      );
    } else {
      return res.json()
    }})
    .then((response) => {
      alert(response.result);
      this.props.pageMethod();
      this.props.getContentsMethod("index");
      debugger
    });
  };

  render () {
    if (this.props.value == "diaries" && this.state.isGetResult == "not yet"){
      if(this.props.diaries.length == 0){
        this.setState({isGetResult: "none"})
        return null
      }else{
        for(let i = 0; i < this.props.diaries.length; i=i+2){
          if((this.props.diaries[i].created_at).match(this.props.day)){
            this.setState({isGetResult: "exist"})
            return null  
        }}
      }this.setState({isGetResult: "none"})
      return null
    }else if(this.props.value == "diaries" && this.state.isGetResult == "exist"){
      return(
      <div className="main-content">
        <p>投稿済みです。</p>
      </div>
      )
    }else if(this.props.value == "diaries" && this.state.isGetResult == "none"){
      return(
        <div className="main-content">
          <div className="post-form" key="Q1" id="post-form">
            <label htmlFor="Q1" className="post-label">Q1</label>
            <textarea id="Q1" className="input-box-content" rows="10" cols="70" value={this.state.isContentQ1} onChange={(e) => {this.setState({isContentQ1: e.target.value})}}></textarea>
          </div>
          <div className="post-form" key="Q2" id="post-form">
            <label htmlFor="Q2" className="post-label">Q2</label>
            <textarea id="Q2" className="input-box-content" rows="10" cols="70" value={this.state.isContentQ2} onChange={(e) => {this.setState({isContentQ2: e.target.value})}}></textarea>
          </div>
          <button id="post-btn" onClick={()=>{this.postContent()}}>投稿する</button>
        </div>
      )
    }else if(this.props.value == "memos"){
      return(
        <div className="main-content">
          <form className="post-form" id="post-form">
            <label htmlFor="memo-post" id="post-label">メモ</label>
            <textarea id="memo-post" className="input-box-content" rows="10" cols="70" value={this.state.isContentMemo} onChange={(e) => {this.setState({isContentMemo: e.target.value})}}></textarea>
          </form>
          <button id="post-btn" onClick={()=>{this.postContent()}}>投稿する</button>
        </div>)
    };
  };
};
export default PostCreate;

// 課題
// ① textareaに入力する度に、renderが走ってpostContentが実行してしまう。
// 理由：onChangeでstateが更新されるため。
// 対処案：postContentの実行結果でreturnを分岐させるのではなく、stateの中身で判断する。
// postContentの処理結果はstateに保存する。

// ② createアクションの作成
// 現在は何も入れていないので、paramsから作成する必要あり。

// ③ 投稿詳細ページの一本化
// diaryのid/memoのid と fetch APIを組み合わせればおそらく可能。