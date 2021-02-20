import React from "react"
import PropTypes from "prop-types"
class Memo extends React.Component {
  constructor(props){
    super(props)
  }

  render () {
    const memoList = [];
    for (let i = 0; i < this.props.value.length; i++){
      if((this.props.value[i].created_at).match(this.props.day)){
        memoList.push(
        <li key={"content-memo"+`${i}`} id={"content-memo"+`${i}`} className="memo-content">{this.props.value[i].content}</li>,
        <a href={`/memos/${this.props.value[i].id}`}><li key={"edit-memo"+`${i}`} id={"edit-memo"+`${i}`}>Edit</li></a>)
      }};
    return (
      <div className="contents-posts">
        <div className="lists">
          <p id="post-title">メモ</p>
        </div>
        <ul className="content-list">
          {memoList}
        </ul>
      </div>
      );
  };
};
export default Memo
