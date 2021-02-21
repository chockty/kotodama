import React, { useLayoutEffect } from "react"
import PropTypes from "prop-types"
class ContentShowEdit extends React.Component {
  // 初期設定
  constructor(props){
    super(props)
    if(this.props.category == "diaries" || this.props.category == "memos") {
      this.state = {
        isEdit: false,
        isContent: this.props.post.content,
        isCategory: this.props.category
      };
    }else if(this.props.category == "users"){
      this.state = {
        isEdit: false,
        isCategory: this.props.category,
        isUserNickName: this.props.post[0].nickname,
        isUserEmail: this.props.post[0].email,
        isRemindEmail: this.props.post[1].mail_remind,
        isRemindLine: this.props.post[1].line_remind,
      };
    };
  };

  //共通のメソッド
  handleIsEdit(e){
    if(this.state.isEdit == false){
      this.setState({isEdit: true})
    } else {
      this.handleOnChange(e)
      this.setState({isEdit: false})
    }
  };

  handleOnChange(e){
    if(e.target){
      this.setState({[e.target.name]: e.target.value})
    } else {
      if(this.state.isCategory == "users" && this.state.isEdit == true){
        this.setState({isUserNickName: e.post[0].nickname})
        this.setState({isUserEmail: e.post[0].email})
        this.setState({isRemindEmail: e.post[1].mail_remind})
        this.setState({isRemindLine: e.post[1].line_remind})
      } else {
        this.setState({isContent: e.post.content})
      }
    }
  };

  updateContent(content){
    const authToken = document.querySelector('meta[name="csrf-token"]');
    let contentBody = "";
    let fetchUrl = "";
    if(this.state.isCategory == "users"){
      contentBody = {
        id: this.props.post[0].id,
        nickname: content[0],
        email: content[1],
        mail_remind: content[2],
        line_remind: content[3]
      };
      fetchUrl = this.props.post[0].id;
    }else{
        contentBody = {
          id: this.props.post.id,
          content: content
        };
        fetchUrl = this.props.post.id;
      };
    const requestOptions = {
    method: 'PATCH',
    headers: new Headers({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-Token': authToken.content
    }),
    body: JSON.stringify(contentBody)
    };
    fetch(`/${this.state.isCategory}/${fetchUrl}`, requestOptions)
    .then(res => {if(!res.ok){
      return (
        alert("Error, unable to update")
      );
    } else {
      return res.json()
    }})
    .then((response) => {
      this.handleIsEdit(response)
    });
  };

  //ユーザ情報表示/編集画面用のメソッド
  judgeEmailOrLine(func){
    const currentMode = ["OFF", "ON"]
    let num = 0;
    let emailOrLine = 0;
    if(func == "Email"){
      emailOrLine = Number(this.state.isRemindEmail)
      }else if(func == "Line"){
        emailOrLine = Number(this.state.isRemindLine)
      }
    if(emailOrLine == 0){
      num = 1;
    };
    return (
      <select id={`user-remind-${func}-box`} name={`isRemind${func}`} value={emailOrLine} onChange={(e) => this.handleOnChange(e)}>
        <option value={emailOrLine}>{currentMode[emailOrLine]}</option>
        <option value={num}>{currentMode[num]}</option>
      </select>
    )}

  userInfo(edit){
    if (edit == true){
      let forUpdate = [this.state.isUserNickName, this.state.isUserEmail, this.state.isRemindEmail, this.state.isRemindLine];
      return(
        <div className="main-content">
          <ul className="show-edit-content-list">
            <li key="edit-user-nickname-box" id="show-user-nickname" className="user-info">
              <label >Nickname</label>
              <textarea value={this.state.isUserNickName} id="user-nickname-box" name="isUserNickName" cols="20" onChange={(e) => this.handleOnChange(e)}></textarea>
            </li>

            <li key="edit-user-email-box" id="show-user-email" className="user-info">
              <label htmlFor="user-email-box" className="user-label">Email</label>
              <textarea value={this.state.isUserEmail} id="user-email-box" name="isUserEmail" cols="20" onChange={(e) => this.handleOnChange(e)}></textarea>
            </li>

            <li key="edit-user-remind-email-box" id="show-user-remind-email" className="user-info">
              <label htmlFor="user-remind-email-box" className="user-label">メールリマインド</label>
              <div id="user-remind-email-box" className="user-status">{this.judgeEmailOrLine("Email")}</div>
            </li>

            <li key="edit-user-remind-line-box" id="show-user-remind-line" className="user-info">
              <label htmlFor="show-remind-line-box" className="user-label">LINEリマインド</label> 
              <div id="user-remind-line-box" className="user-status">{this.judgeEmailOrLine("Line")}</div>
            </li>

          </ul>
          <div className="btn-area">
            <button id="show-edit-btn" onClick={()=>{this.handleIsEdit(this.props)}}>戻る</button>
            <button id="show-edit-btn" onClick={()=>{this.updateContent(forUpdate)}}>更新する</button>
          </div>
        </div>  
        )
    } else {
      return(
        <div className="main-content">
          <ul className="show-edit-content">
            <li key="show-user-nickname-box" id="show-user-nickname" className="user-info">
              <label htmlFor="show-user-nickname-box" className="user-label">Nickname</label>
              <div id="show-user-nickname-box" className="user-status">{this.state.isUserNickName}</div>
            </li>
            
            <li key="show-user-email-box" id="show-user-email" className="user-info">
              <label htmlFor="show-user-email-box" className="user-label">Email</label>
              <div id="show-user-email-box" className="user-status">{this.state.isUserEmail}</div>
            </li>

            <li key="show-user-remind-email-box" id="show-user-remind-email" className="user-info">
              <label htmlFor="show-user-remind-email-box" className="user-label">メールリマインド</label>
              {this.state.isRemindEmail == 1? (<div id="show-user-remind-email-box" className="user-status">ON</div>):
              (<div id="show-user-remind-email-box" className="user-status">OFF</div>)}
            </li>
            
            <li key="show-user-remind-line-box" id="show-user-remind-line" className="user-info">
              <label htmlFor="show-user-remind-line-box" className="user-label">LINEリマインド</label>
              {this.state.isRemindLine == 1? (<div id="show-user-remind-line-box" className="user-status">ON</div>):
              (<div id="show-user-remind-line-box" className="user-status">OFF</div>)}
            </li>
          </ul>
          <div className="btn-area">
            <button id="show-edit-btn" onClick={()=>{this.handleIsEdit("blank")}}>編集する</button>
            <button id="show-edit-btn" value="go-toppage" ><a href={`/users/${this.props.post[0].id}/contents`}>トップページへ</a></button>
          </div>
        </div>
      )
    }
  };

  //日記/メモ用のメソッド
  diaryMemoInfo(edit){
    if(edit == true){
    return(
      <div className="main-content">
        <textarea value={this.state.isContent} name="isContent" id="content-box"  rows="7" cols="70" onChange={(e) => this.handleOnChange(e)}></textarea>
        <div className="btn-area">
          <button id="show-edit-btn" onClick={()=>{this.handleIsEdit(this.props)}}>戻る</button>
          <button id="show-edit-btn" onClick={()=>{this.updateContent(this.state.isContent)}}>更新する</button>
        </div>
      </div>
      );
    } else {
      return(
      <div className="main-content">
        <ul className="show-edit-content-list">
          <li key={`${this.props.post.id}`} className="show-edit-content">{this.state.isContent}</li>
          <li key={`${this.props.post.id}-created`} className="show-edit-content">{this.props.post.created_at}</li>
        </ul>
        <div className="btn-area">
          <button id="show-edit-btn" onClick={()=>{this.handleIsEdit("blank")}}>編集する</button>
          <button id="show-edit-btn" value="go-toppage"><a href={`/users/${this.props.post.user_id}/contents`}>トップページへ</a></button>
        </div>
      </div>
      )
    };
  };

  judgeQuestion(post){
    if (!post.question){
      return null
    } else if ((post.question) && (post.question == 1)){
      return(<p>Q1</p>)
    }else{
      return(<p>Q2</p>)
    };
  };

  // 最終的なページ状態
  render () {
    if(this.state.isCategory == "users"){
      return(
        <div className="posted-content">
          {this.userInfo(this.state.isEdit)}
        </div>
      )
    }else{
      return (
        <div className="posted-content">
          {this.judgeQuestion(this.props.post)}
          {this.diaryMemoInfo(this.state.isEdit)}
        </div>
        );
    };
  };
 };

export default ContentShowEdit
